<template>
  <div>
    <v-snackbar
      location="top"
      elevation="12"
      v-model="showSnackbar"
      :timeout="timeout"
      :color="color">
      <v-container>
        <div v-for="(message,i) in messages" v-bind:key="i">
          {{message.msg}}
        </div>
      </v-container>

      <!--
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false">
          Fechar
        </v-btn>
      </template>
      -->

    </v-snackbar>
  </div>
</template>

<script>
  import {notificationStore} from "@/store/notification";
  export default {
    name: "AlertNotification",
    data() {
      return {
          store : notificationStore(),
          timeout: 3000
      }
    },
    mounted(){

    },
    computed: {
      showSnackbar: {
        get: function () {
            const notificationStatus = this.store.notificationStatus
            return notificationStatus !== 'HIDE';
        },
        set: function () {
            this.store.clearNotification();
        }
      },
      messages() {
        return this.store.notificationMessages
      },
      color(){
        const notificationStatus = this.store.notificationStatus
        if (notificationStatus === 'ERROR') {
            return "error";
        }
        if (notificationStatus ==='SUCCESS') {
            return "success";
        }
        if (notificationStatus === 'WARNING') {
            return "warning";
        }
        return "primary";
      }
    }
  }
</script>

<style scoped>

</style>
