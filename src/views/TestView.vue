<template>
  <v-card flat>
    <v-card-title>
      <h3>Área de Teste</h3>
    </v-card-title>

    <v-divider></v-divider>

    <v-container fluid>
      <v-btn @click="openDialog" color="primary">Abrir Draggable Dialog</v-btn>
      <v-btn @click="removeAllSchedules" color="primary">Remover agendamentos.</v-btn>
      <draggable-dialog
        identifier="teste"
        v-model="show"
        v-on:closeEvent="closeModal"
        :draggable="true"
        title="Teste"
        width="500">
        Hello World!
      </draggable-dialog>
    </v-container>
  </v-card>
</template>

<script>
import {authenticationStore} from "@/store/authentication";
import {notificationStore} from "@/store/notification";
import {loadingStore} from "@/store/loading";
import DraggableDialog from "@/components/DraggableDialog.vue";
import JoyButton from "@/components/JoyButton.vue";
import scheduleService from "@/services/schedule";

const message = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];

export default {
  components: {DraggableDialog, JoyButton},
  data(){
    return{
      authenticationStore: authenticationStore(),
      notificationStore: notificationStore(),
      loadingStore: loadingStore(),
      show: false,
      isDragging : false,
      list: message.map((name, index) => {
        return { name, order: index + 1 };
      })
    }
  },
  methods:{
    openDialog(){
      this.show = true;
    },
    closeModal(){
      this.show = false;
    },
    async removeAllSchedules(){
      try{
        this.loadingStore.loadingStart();
        await scheduleService.removeAllSchedules();
        this.notificationStore.setSuccessMessages([{msg: "Todos os agendamentos removidos."}]);
      }catch (e) {
        this.notificationStore.setErrorMessages(e.data.errors);
      }finally {
        this.loadingStore.loadingEnd();
      }
    }
  }
}
</script>

<style scoped>

</style>
