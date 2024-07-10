<template>
  <div>
    <v-card style="padding-bottom: 50px" flat>
      <template v-slot:prepend>
        <v-card-title>
          <h3>
            Experimentos
          </h3>
        </v-card-title>
      </template>
      <template v-slot:append>
        <v-btn
          class="ma-2"
          color="indigo"
          v-on:click="createNewLaboratory"
          v-show="user.role === 'ADMINISTRATOR'"
          dark>
          Novo Experimento
        </v-btn>
      </template>

      <v-divider></v-divider>

      <v-container fluid>
        <v-row dense>
          <v-col
              v-for="(room, index) in rooms"
              :key="room.laboratory._id"
              :md="3">
            <v-card>
              <v-img
                  :src="room.laboratory.imageLink"
                  class="text-white"
                  cover
                  height="250px">
                <v-toolbar color="rgba(230, 230, 230, 0.80)">
                  <template v-slot:prepend >
                    <v-chip v-show="room.state === 'FREE'">
                      Lab. Livre
                      <v-icon color="green">mdi-circle-medium</v-icon>
                    </v-chip>

                    <v-chip v-show="room.state === 'IN_USE'">
                      Lab. em Uso
                      <v-icon color="red">mdi-circle-medium</v-icon>
                    </v-chip>

                    <v-chip v-show="room.state === 'MAINTENANCE'">
                      Lab. em Manutenção
                      <v-icon color="yellow">mdi-circle-medium</v-icon>
                    </v-chip>
                  </template>

                  <template v-slot:append>
                    <v-btn icon density="comfortable" v-show="user.role === 'ADMINISTRATOR'" v-on:click="orderBackward(room)" :disabled="disableBackwardButton(index)">
                      <v-icon>mdi-menu-left-outline</v-icon>
                    </v-btn>
                    <v-btn icon density="comfortable" v-show="user.role === 'ADMINISTRATOR'" v-on:click="orderForward(room)" :disabled="disableForwardButton(index)">
                      <v-icon>mdi-menu-right-outline</v-icon>
                    </v-btn>

                    <v-btn icon density="comfortable" v-show="user.role === 'ADMINISTRATOR'" v-on:click="editLaboratory(room.laboratory)">
                      <v-icon>mdi-note-edit-outline</v-icon>
                    </v-btn>

                    <v-btn icon density="comfortable" v-show="user.role === 'ADMINISTRATOR'" v-on:click="removeLaboratory(room.laboratory._id)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                </v-toolbar>
              </v-img>

              <v-card-title >{{room.laboratory.name}}</v-card-title>
              <v-card-subtitle >{{room.laboratory.description}}</v-card-subtitle>
              <br/>

              <div v-if="room.accessGranted && room.hasNextSchedule">
                <v-card-subtitle>Você tem um agendamento:</v-card-subtitle>
                <v-card-subtitle style="color: green; font-weight: bold">{{room.scheduleLabel}}</v-card-subtitle>
              </div>
              <div v-else-if="room.hasNextSchedule">
                <v-card-subtitle>Sua próxima sessão começa em:</v-card-subtitle>
                <v-card-subtitle  style="color: black; font-weight: bold">{{room.scheduleLabel}}</v-card-subtitle>
              </div>
              <div v-else>
                <v-card-subtitle>Atenção:</v-card-subtitle>
                <v-card-subtitle  style="color: darkorange; font-weight: bold">{{room.scheduleLabel}}</v-card-subtitle>
              </div>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon density="comfortable" @click="openLaboratorySchedules(room.laboratory)">
                  <v-icon>mdi-calendar-clock</v-icon>
                </v-btn>

                <v-btn icon density="comfortable" v-on:click="showLabDataModel(room.laboratory)" v-show="user.role === 'ADMINISTRATOR'">
                  <v-icon>mdi-folder-information-outline</v-icon>
                </v-btn>

                <v-btn icon density="comfortable" v-on:click="laboratoryInterface(room.laboratory)" :disabled="!room.enterButtonState">
                  <v-icon v-if="room.accessGranted" style="color: green">mdi-arrow-right</v-icon>
                  <v-icon v-else>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        </v-container>
    </v-card>

    <v-dialog
        v-model="labDataDialog"
        width="auto">
      <v-card>
        <v-card-title class="text-h5">
          Informações
        </v-card-title>
        <v-card-text>
          <p class="text-wrap">
            Nome: {{labData.name}}
          </p>
          <p class="text-wrap">
            ID: {{labData._id}}
          </p>
          <p class="text-wrap">
            Senha: {{labData.password}}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block v-on:click="labDataDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showLaboratorySchedules"
      :fullscreen="true"
      transition="dialog-bottom-transition">
      <v-card class="overflow-hidden">
        <v-toolbar
          dark
          color="primary">
          <v-btn
            icon
            dark
            @click="showLaboratorySchedules = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Agendamentos - {{laboratorySchedules.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <laboratory-schedules :laboratory-id="laboratorySchedules._id" v-on:update-schedules="updateSchedulesArray"/>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import laboratoryService from '../services/laboratory'
  import {loadingStore} from "@/store/loading";
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";
  import LaboratorySchedules from "@/components/LaboratorySchedules.vue";
  import scheduleService from "@/services/schedule";
  import {DateTime, Duration} from "luxon";

  export default {
    name: "LaboratoriesView",
    components:{
      LaboratorySchedules
    },
    data() {
      return {
        webSocketURL: 'ws://localhost:5000/',
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        loadingStore: loadingStore(),
        rooms: [],
        labDataDialog:false,
        labData:{},
        user: {},
        token: "",
        closedByUser: false,
        socket:{},
        reconnectTimeout:{},
        showLaboratorySchedules: false,
        laboratorySchedules:{id:0},
        schedules:[],
        schedulesVerifyHandle:{}
      }
    },
    beforeMount() {
      this.user = this.authenticationStore.authenticatedUser.data;
      this.token = this.authenticationStore.authenticatedUser.token;
    },
    created() {
      this.user = this.authenticationStore.authenticatedUser.data;
      this.token = this.authenticationStore.authenticatedUser.token;
      this.initWebSocket();
    },
    mounted() {
      this.loadingStore.loadingEnd();
      this.loadUserSchedules();
      this.verifySchedules();
    },
    beforeUnmount() {
      this.socket.close();
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.schedulesVerifyHandle);
      this.closedByUser = true;
      this.socket.close();
      next();
    },
    methods: {
      async loadUserSchedules(){
        try{
          this.schedules = await scheduleService.listUserSchedules();
        }catch (response){
          this.notificationStore.setErrorMessages(response.data.errors);
        }finally {
          this.loadingStore.loadingEnd();
        }
      },
      openLaboratorySchedules(laboratory){
        this.laboratorySchedules = laboratory;
        this.showLaboratorySchedules = true;
      },
      orderForward(room){
        const rooms = this.rooms;
        for(let i = 0; i < rooms.length; i++){
          if(rooms[i].laboratory._id === room.laboratory._id && i < rooms.length-1){
            let aux = rooms[i+1];
            rooms[i+1] = room;
            rooms[i] = aux;

            rooms[i].laboratory.orderLab = room.laboratory.orderLab;
            rooms[i+1].laboratory.orderLab = room.laboratory.orderLab + 1;

            this.save(rooms[i].laboratory);
            this.save(room.laboratory);

            break;
          }
        }
      },
      orderBackward(room){
        const rooms = this.rooms;
        for(let i = 0; i < rooms.length; i++){
          if(rooms[i].laboratory._id === room.laboratory._id && i > 0){
            let aux = rooms[i-1];
            rooms[i-1] = rooms[i];
            rooms[i] = aux;

            rooms[i].laboratory.orderLab = room.laboratory.orderLab;
            rooms[i-1].laboratory.orderLab = room.laboratory.orderLab - 1;

            this.save(rooms[i].laboratory);
            this.save(room.laboratory);

            break;
          }
        }
      },
      disableForwardButton(index){
        if(index === this.rooms.length - 1){
          return true;
        }
      },
      disableBackwardButton(index){
        if(index === 0){
          return true;
        }
      },
      async save(laboratory) {
        try {
          await laboratoryService.updateLaboratory(laboratory);
          this.notificationStore.setSuccessMessages([{msg: "Laboratório atualizado com sucesso!"}]);
          this.socket.send(JSON.stringify({
            messageType: "LIST_LABORATORIES",
            role: "USER",
            token: this.token
          }));
        }catch (response) {
          this.notificationStore.setErrorMessages(response.data.errors);
        }
      },
      reconnect(){
        this.loadingStore.loadingStart();
        this.notificationStore.setWarningMessages([{msg:"Reconectando..."}]);
        this.reconnectTimeout = setTimeout(this.initWebSocket,5000);
      },
      initWebSocket() {
        this.loadingStore.loadingStart();

        this.socket = new WebSocket(this.webSocketURL);

        this.socket.onopen = async () => {
          await clearTimeout(this.reconnectTimeout);
          this.loadingStore.loadingEnd();
          this.socket.send(JSON.stringify({
            messageType: "LIST_LABORATORIES",
            role: "USER",
            token: this.token
          }));
        }

        this.socket.onclose = async () => {
          if(!this.closedByUser) {
            this.socket.close();
            this.reconnect();
          }
        }

        this.socket.onmessage = async (msg) => {
          const data = JSON.parse(msg.data);
          switch (data.messageType) {
            case 'LIST_LABORATORIES':
              this.rooms = data.message
              this.rooms.sort((roomA, roomB)=>{
                return roomA.laboratory.orderLab - roomB.laboratory.orderLab;
              });

              this.loadingStore.loadingEnd();
              break;
            case 'LABORATORY_STATE':
              this.rooms.forEach(room=>{
                if(room.laboratory._id === data.laboratoryId){
                  room.state = data.message
                }
              });
              break;
          }
        }
      },
      updateSchedulesArray(){
        this.loadUserSchedules();
      },
      verifySchedules(){
        const that = this;
        this.schedulesVerifyHandle = setInterval(async () => {
           for (let i in that.rooms) {
             const room = that.rooms[i];
             const nextSchedule = await that.findNextScheduleByLaboratoryId(room.laboratory._id);

             if(!nextSchedule){
               room.enterButtonState = await this.defineLaboratoryEnterButtonState(room);
               room.hasNextSchedule = false;
               room.scheduleLabel = 'Agende um horário.';
               continue;
             }

             room.hasNextSchedule = true;
             const now = DateTime.now();
             const start = nextSchedule.start;
             const end = nextSchedule.end;

             if (now >= start && now < end) {
               room.accessGranted = true;
               room.scheduleLabel = 'Acesso liberado.';
               room.enterButtonState = await this.defineLaboratoryEnterButtonState(room);
               continue
             }

             room.accessGranted = false;
             room.enterButtonState = await this.defineLaboratoryEnterButtonState(room);
             const diff = start.diff(now, 'seconds').toObject();
             room.scheduleLabel = Duration.fromObject({seconds: parseInt(diff.seconds,10)}).toFormat("hh:mm:ss");
           }
        },1000);
      },
      async defineLaboratoryEnterButtonState(room){
        if(room.state==='FREE'){
          return true;
        }
        if(room.accessGranted){
          return true;
        }
        if(room.state==='IN_USE'){
          return false;
        }
        if(room.state==='MAINTENANCE'){
          return false;
        }
        return false;
      },
      async findNextScheduleByLaboratoryId(laboratoryId){
        const now = DateTime.now();
        for (let i = 0; i < this.schedules.length; i++) {
          const schedule = this.schedules[i];
          schedule.start = DateTime.fromISO(schedule.start);
          schedule.end = DateTime.fromISO(schedule.end);
          if (schedule.end < now){
            continue;
          }
          if (schedule.laboratoryId === laboratoryId) {
            return schedule;
          }
        }
        return null;
      },
      showLabDataModel(laboratory){
        this.loading = true;
        this.labData = laboratory;
        laboratoryService.findLaboratoryById(laboratory._id)
            .then(data => {
              this.loading = false;
              this.labData = data;
              this.labDataDialog = true;
            })
            .catch(response => {
              response
              this.loading = false;
            })
      },
      laboratoryInterface(laboratory){
        this.loadingStore.loadingStart();
        this.socket.close();
        const id = laboratory._id;
        this.$router.push({name: 'laboratory-interface', params: {id}});
      },
      createNewLaboratory() {
        this.$router.push({name: 'laboratory-form'})
      },
      editLaboratory(laboratory){
        const id = laboratory._id;
        this.$router.push({name: 'laboratory-form', params: {id}})
      },
      async removeLaboratory(id){
        this.loadingStore.loadingStart();
        await laboratoryService.removeLaboratory(id);
        await this.socket.send(JSON.stringify({
          messageType: "LIST_LABORATORIES",
          role: "USER",
          token: this.token
        }));
      }
    }
  }
</script>

<style scoped>

</style>
