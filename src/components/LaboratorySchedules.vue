<template>
  <qalendar
            id="laboratorySchedules"
            :config="config"
            :events="schedules"
            style="height: 490px"
            @event-was-clicked="scheduleClicked"
            @delete-event="removeSchedule"
            @interval-was-clicked="newSchedule"
            @event-was-resized="updateSchedule"
            @event-was-dragged="updateSchedule"/>

  <div style="display: inline-block;">
    <v-chip
      class="ma-2"
      color="#FFA500"
      label
      variant="outlined"
      append-icon="mdi-square">
      Seus agendamentos
    </v-chip>

    <v-chip
      class="ma-2"
      color="#6495ED"
      label
      variant="outlined"
      append-icon="mdi-square">
      Agendamentos de outros usuários
    </v-chip>

    <v-chip
      class="ma-2"
      color="#C0C0C0"
      label
      variant="outlined"
      append-icon="mdi-square">
      Agendamentos passados
    </v-chip>
  </div>
</template>

<script>
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";
  import {loadingStore} from "@/store/loading";
  import Schedule from "@/models/Schedule";
  import scheduleService from "@/services/schedule";
  import {Qalendar} from "qalendar";
  import {DateTime} from "luxon";

  export  default {
    emits: ['updateSchedules'],
    props:['laboratoryId'],
    components:{
      Qalendar
    },
    data(){
      return{
        counter:1,
        dateFormat:"yyyy-MM-dd HH:mm",
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        loadingStore: loadingStore(),
        schedule: new Schedule(),
        schedules:[],
        config: {
          style: {
            colorSchemes: {
              olderSchedules: {
                color: '#fff',
                backgroundColor: '#C0C0C0',
              },
              mySchedules: {
                color: '#fff',
                backgroundColor: '#FFA500',
              },
              anotherPersonsSchedules: {
                color: '#fff',
                backgroundColor: '#6495ED',
              }
            }
          },
          week: {
            startsOn: 'monday',
            nDays: 7,
            scrollToHour: DateTime.now().hour
          },
          defaultMode: 'week',
          showCurrentTime: true,
          dayIntervals: {
            length: 30,
            height: 40,
            displayClickableInterval: true,
          },
          dayBoundaries: {
            start: 1,
            end: 23,
          }
        }
      }
    },
    mounted() {
      this.loadingStore.loadingStart();
      this.listLaboratorySchedules();
    },
    methods:{
      newSchedule(evt){
        this.schedule = new Schedule();
        this.schedule.id = this.counter++;
        this.schedule.title = this.authenticationStore.authenticatedUser.data.name;
        this.schedule.userId = this.authenticationStore.authenticatedUser.data.id;
        this.schedule.laboratoryId = this.laboratoryId;
        this.schedule.start = DateTime.fromFormat(evt.intervalStart, this.dateFormat);
        this.schedule.end = this.schedule.start.plus({minutes:60});
        this.schedule.time.start = evt.intervalStart;
        this.schedule.time.end = this.schedule.end.toFormat(this.dateFormat);
        this.schedules.push(this.schedule);
        this.saveSchedule();
      },
      scheduleClicked(evt){
        this.schedule = evt.clickedEvent;
      },
      async listLaboratorySchedules(){
        try{
          const schedules = await scheduleService.listLaboratorySchedules(this.laboratoryId);
          for(let i in schedules){
            schedules[i].id = schedules[i]._id;
            schedules[i].isEditable = false;
            schedules[i].start = DateTime.fromISO(schedules[i].start);
            schedules[i].end = DateTime.fromISO(schedules[i].end);
            schedules[i].colorScheme = 'anotherPersonsSchedules';
            schedules[i].time = {
              start: schedules[i].start.toFormat(this.dateFormat),
              end: schedules[i].end.toFormat(this.dateFormat)
            }
            schedules[i].historic = {
              start: schedules[i].start,
              end: schedules[i].end
            }
            if(schedules[i].userId === this.authenticationStore.authenticatedUser.data.id){
              schedules[i].colorScheme = 'mySchedules';
              schedules[i].isEditable = true;
            }
            if(schedules[i].end < DateTime.now()){
              schedules[i].colorScheme = 'olderSchedules';
              schedules[i].isEditable = false;
            }
            if(this.authenticationStore.authenticatedUser.data.role === 'ADMINISTRATOR'){
              schedules[i].isEditable = true;
            }
          }
          this.$emit('updateSchedules');
          this.schedules = schedules;
        }catch (response){
          this.notificationStore.setErrorMessages(response.data.errors);
        }finally {
          this.loadingStore.loadingEnd();
        }
      },
      async validateTime(schedule){
        const start = schedule.start;
        const end = schedule.end;
        const diff = end.diff(start,'minutes').toObject();
        if(diff.minutes > 60){
          throw {
            data:{
              errors:[{msg: "Não é possível alterar o tempo para mais de 60 minuto."}]
            }
          };
        }
        if(diff.minutes < 30){
          throw {
            data:{
              errors:[{msg: "Não é possível alterar o tempo para menos de 30 minutos."}]
            }
          };
        }
        if(end.hour >= 23 && end.minutes > 30){
          schedule.end = schedule.end.minus({minutes:30});
        }
      },
      async validateLimitOfSchedules(schedule) {
        const start = schedule.start;
        const schedules = this.schedules;
        let total = schedule.end.diff(start,'minutes').toObject().minutes;
        for(let i in schedules) {
          const anotherSchedule = schedules[i];
          const anotherScheduleStart = anotherSchedule.start;
          const anotherScheduleEnd = anotherSchedule.end;
          if (anotherSchedule.userId !== schedule.userId) {
            continue;
          }

          if(anotherSchedule.id === schedule.id){
            continue;
          }

          if (start.hasSame(anotherScheduleStart, 'day') || start.hasSame(anotherScheduleEnd, 'day')) {
            total = total + anotherScheduleEnd.diff(anotherScheduleStart,'minutes').toObject().minutes;
          }
        }
        if(total > 60){
          const ajustDiff = total-60
          schedule.end = schedule.end.minus({minutes:ajustDiff});
          total = total - ajustDiff;
        }
        if(total > 60 || schedule.end.diff(start,'minutes').toObject().minutes < 30){
          throw {
            data:{
              errors:[{msg: "O tempo total de seus agendamentos não pode ultrapassar 1 hora por dia."}]
            }
          };
        }
      },
      async validateConflict(schedule){
        const start = schedule.start;
        const end = schedule.end;
        const now = DateTime.now();

        if(now >= start && now < end){
          throw {
            data:{
              errors:[{msg: "Não é possível alterar este agendamento, ele já está acontecendo."}]
            }
          };
        }

        const schedules = this.schedules;
        for(let i in schedules){
          const anotherSchedule = schedules[i];

          if(anotherSchedule.id === schedule.id){
            continue;
          }

          if(!start.hasSame(anotherSchedule.start, 'day') && !start.hasSame(anotherSchedule.end, 'day')){
            continue;
          }

          if(start.equals(anotherSchedule.start) || end.equals(anotherSchedule.end)){
            throw {
              data:{
                errors:[{msg: "Horário escolhido entra em conflito com horário já agendado"}]
              }
            };
          }

          if(start < anotherSchedule.end && start > anotherSchedule.start){
            throw {
              data:{
                errors:[{msg: "Horário escolhido entra em conflito com horário já agendado"}]
              }
            };
          }

          if(end < anotherSchedule.end && end > anotherSchedule.start){
            throw {
              data:{
                errors:[{msg: "Horário escolhido entra em conflito com horário já agendado"}]
              }
            };
          }
        }
      },
      async validateDate(schedule){
        const now = DateTime.now();
        if(schedule.start < now){
          throw {
            data:{
              errors:[{msg: "Não é possível alterar para data ou hora passada"}]
            }
          };
        }

        if(!schedule.historic){
          return;
        }

        const historicStart = schedule.historic.start;
        const historicEnd = schedule.historic.end;

        if(now >= historicStart && now <= historicEnd ){
          throw {
            data:{
              errors:[{msg: "Não é possível altera, agendamento já está ocorrendo"}]
            }
          };
        }
      },

      async validateToRemove(){
        const now = DateTime.now();
        if(now >= this.schedule.start && now <= this.schedule.end ){
          throw {
            data:{
              errors:[{msg: "Não é possível remover, agendamento já está ocorrendo"}]
            }
          };
        }
        if(this.schedule.end < now){
          throw {
            data:{
              errors:[{msg: "Este agendamento já ocorreu, não é possível remover."}]
            }
          };
        }
      },
      async updateSchedule(schedule){
        try{
          schedule.historic = {
            start: schedule.start,
            end: schedule.end
          }
          schedule.start = DateTime.fromFormat(schedule.time.start, this.dateFormat);
          schedule.end = DateTime.fromFormat(schedule.time.end, this.dateFormat);
          await this.validateLimitOfSchedules(schedule);
          await this.validateTime(schedule);
          await this.validateDate(schedule);
          await this.validateConflict(schedule);
          this.loadingStore.loadingStart();
          await scheduleService.updateSchedule(schedule);
          this.notificationStore.setSuccessMessages([{msg: "Agendamento atualizado."}]);
        }catch (response){
          this.notificationStore.setErrorMessages(response.data.errors);
        }finally {
          await this.listLaboratorySchedules();
          this.loadingStore.loadingEnd();
        }
      },
      async saveSchedule(){
        try{
          await this.validateLimitOfSchedules(this.schedule);
          await this.validateTime(this.schedule);
          await this.validateDate(this.schedule);
          await this.validateConflict(this.schedule);
          this.loadingStore.loadingStart();
          await scheduleService.createSchedule(this.schedule);
          this.notificationStore.setSuccessMessages([{msg: "Agendamento salvo."}]);
        }catch (response){
          this.notificationStore.setErrorMessages(response.data.errors);
        }finally {
          await this.listLaboratorySchedules();
          this.loadingStore.loadingEnd();
        }
      },
      async removeSchedule(){
        try{
          await this.validateToRemove();
          this.loadingStore.loadingStart();
          await scheduleService.removeSchedule(this.schedule.id);
          this.notificationStore.setSuccessMessages([{msg: "Agendamento removido"}]);
        }catch (response){
          this.notificationStore.setErrorMessages(response.data.errors);
        }finally {
          await this.listLaboratorySchedules();
          this.loadingStore.loadingEnd();
        }
      }
    }
  }
</script>

<style>
  @import "qalendar/dist/style.css";
</style>
