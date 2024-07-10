<template>
  <v-card flat>
    <template v-slot:prepend>
      <v-card-title>
        <h3>Meus Dados</h3>
      </v-card-title>
    </template>

    <template v-slot:append>
      <v-btn class="ma-2"
             color="indigo"
             v-on:click="editUser"
             dark>
        Alterar Dados
      </v-btn>
      <v-btn class="ma-2"
             color="indigo"
             v-on:click="redefinePassword"
             dark>
        Redefinir Senha
      </v-btn>
    </template>

    <v-divider></v-divider>

    <v-card-text>
      <p>Nome: {{user.name}}</p>
      <p>E-mail: {{user.email}}</p>
      <p>Papel: {{user.role}}</p>
      <p>Data de Criação: {{formatDate(user.creationDate)}}</p>
    </v-card-text>
  </v-card>
</template>

<script>
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";
  import userService from '../services/user'
  import User from "../models/User";
  import {DateTime} from "luxon";
  export default {
    name: "MyData",
    data() {
      return {
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        user: new User()
      }
    },
    mounted() {
      this.findUserById();
    },
    watch: {
      options: {
        handler() {
          this.listUsersByPage()
        },
        deep: true,
      },
    },
    methods: {
      async findUserById(){
        try{
          this.loading = true;
          const id = this.authenticationStore.authenticatedUser.data.id;
          this.user = await userService.findUserById(id);
          this.user.id = this.user._id;
          this.loading = false;
        }catch (response){
          this.loading = false;
          this.notificationStore.setErrorMessages(response.data.errors);
        }
      },
      redefinePassword() {
        this.$router.push({name: 'my-password-redefine-form'})
      },
      editUser() {
        this.$router.push({name: 'my-data-edit-form'})
      },
      formatDate(date) {
          if (!date) {
              return '--'
          }
          const dt = DateTime.fromISO(date);
          return dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
      },
      formatRole(role){
        switch (role){
          case 'ADMINISTRATOR':
              return 'Administrador'
          case 'USER':
              return 'Usuário Comum'

        }
      }
    }
  }
</script>

<style scoped>

</style>
