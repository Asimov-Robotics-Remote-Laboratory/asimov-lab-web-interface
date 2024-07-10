<template>
  <div>
    <v-card elevation="12" min-width="200" width="345" :loading="loading" >
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Recuperar Senha</v-toolbar-title>
        <v-spacer></v-spacer>
        Asimov Lab.
        <v-img
          class="mx-2"
          src="@/assets/icons-robo-64.png"
          max-height="40"
          max-width="40"
          contain
        ></v-img>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-text-field
            label="E-mail"
            type="text"
            prepend-icon="mdi-account"
            v-model="user.email">
          </v-text-field>
        </v-form>
      </v-card-text>

      <v-container>
        <v-card-actions>
          <v-btn color="primary"
                 v-on:click="resetPassword">Submeter
          </v-btn>
          <v-btn color="error"
                 v-on:click="cancel">Cancelar
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import User from "@/models/User";
  import resetPassword from "@/services/authentication/resetPassword";
  import {notificationStore} from "@/store/notification";

  export default {
    name: 'ForgotPassword',
    components: {},
    data() {
      return {
        notificationStore: notificationStore(),
        user: new User(),
        loading: false
      }
    },
    mounted() {
      this.loading = false;
    },
    methods: {
      async resetPassword(){
        const email = this.user.email;
        try {
          this.loading = true;
          await resetPassword(email);
          this.notificationStore.setSuccessMessages( [{msg: 'Aguarde, um senha provisória será enviada para o e-mail: '+email}]);
          this.$router.push('/');
        }catch(e){
          this.loading = false;
          this.notificationStore.setErrorMessages(e.data.errors);
        }
      },
      cancel(){
        this.loading = true;
        this.$router.push('/');
      }
    }
  };
</script>
<style scoped>
    .authentication-form {
        padding-top: 100px
    }
</style>
