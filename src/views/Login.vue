<template>
  <div>
    <v-card elevation="12" min-width="200" width="345" :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Login</v-toolbar-title>
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

          <v-text-field
            label="Senha"
            type="password"
            :onkeyup="keyEventHandler"
            prepend-icon="mdi-lock"
            v-model="user.password">
          </v-text-field>
        </v-form>
      </v-card-text>

      <v-container>
        <v-card-actions>
          <a v-on:click="forgotPassword">Esqueci minha senha!</a>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 v-on:click="authenticate">Login
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import User from "@/models/User";
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";
  import {loadingStore} from "@/store/loading";

  export default {
    name: 'LoginView',
    components: {},
    data() {
      return {
        loadingStore: loadingStore(),
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        user: new User(),
        loading: false
      }
    },
    mounted() {
      this.loadingStore.loadingEnd();
      this.loading = false;
    },
    methods: {
      keyEventHandler(evt){
        evt.preventDefault();
        switch (evt.key) {
          case 'Enter':
            this.authenticate();
            break;
        }
      },
      async authenticate() {
        try {
          this.loading = true;
          await this.authenticationStore.authenticate(this.user);
          this.loading = false;
          this.$router.push({name:'home'});
          if(this.authenticationStore.authenticatedUser.data.forcePasswordChange){
            this.notificationStore.setSuccessMessages( [{msg: 'Redefina sua senha.'}]);
          }
        } catch (e) {
          this.loading = false;
          this.notificationStore.setErrorMessages(e.data.errors);
        }
      },
      forgotPassword(){
        this.loading = true;
        this.$router.push({name:'forgot-password'});
      }
    }
  };
</script>

<style scoped>

</style>
