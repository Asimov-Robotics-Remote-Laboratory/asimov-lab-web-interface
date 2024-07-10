<template>
  <div>
    <v-card :loading="loading" flat>
      <v-card-title>
          Usuário
      </v-card-title>

      <v-card-subtitle>
          Alterar Dados
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
                  label="Nome"
                  type="text"
                  outlined
                  dense
                  v-model="user.name"
                  >
          </v-text-field>

          <v-text-field
                  label="E-mail"
                  type="text"
                  outlined
                  dense
                  v-model="user.email"
                 >
          </v-text-field>
        </v-form>
          <v-btn class="ma-2"
                 color="success"
                 dark
                 v-on:click="save">
              Salvar
          </v-btn>
          <v-btn class="ma-2"
                 color="red"
                 dark
                 v-on:click="cancel">
              Cancelar
          </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";
  import userService from '../services/user';
  import User from '@/models/User';

  export default {
    name: "MyDataEditForm",
    data() {
      return {
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        user: new User(),
        roles:['ADMINISTRATOR','USER'],
        loading: false
      }
    },
    mounted() {
      this.findUserById();
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
          const errors = response.data.errors;
          this.loading = false;
          this.notificationStore.setErrorMessages(errors);
        }
      },
      async save() {
        this.loading = true;
        try {
          await userService.updateUser(this.user);
          this.authenticationStore.updateUserData(this.user);
          this.$router.push({name:"my-data"});
          this.loading = false;
          this.notificationStore.setSuccessMessages([{msg: "Usuário atualizado com sucesso!"}]);
        }catch (response) {
          this.loading = false;
          this.notificationStore.setErrorMessages(response.data.errors);
        }
      },
      cancel() {
          this.$router.push({name:"my-data"});
      }
    }
  }
</script>

<style scoped>

</style>
