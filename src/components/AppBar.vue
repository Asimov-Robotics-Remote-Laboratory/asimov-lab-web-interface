<template>
  <v-app-bar app color="primary">
    <!--Botão para mostrar ou esconder o menu lateral (drawer) -->
    <v-app-bar-nav-icon v-on:click="showDrawer = !showDrawer"></v-app-bar-nav-icon>

    <v-img
      class="mx-2"
      src="@/assets/icons-robo-64.png"
      max-height="40"
      max-width="40"
      contain
    ></v-img>

    <v-app-bar-title>
      Asimov Lab.
    </v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
    app
    v-model="showDrawer"
    :expand-on-hover="miniVariant"
    :rail="miniVariant">

    <v-list nav>
      <v-list-item
        prepend-avatar="@/assets/icons-robo-avatar-64.png"
        :title="user.name"
        :subtitle="user.role">
        <template v-slot:append>
          <v-btn
            density="comfortable"
            variant="text"
            icon="mdi-pencil"
            @click="myData"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav >
      <v-list-item prepend-icon="mdi-home" title="Home" to="/" exact></v-list-item>
      <v-list-item prepend-icon="mdi-robot" title="Laboratórios" to="/laboratories"></v-list-item>
      <v-list-item prepend-icon="mdi-account-details" title="Usuários" to="/users" v-show="isAdmin"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Configurações" v-show="isAdmin"></v-list-item>
      <v-list-item prepend-icon="mdi-tools" title="Área de Teste" to="/test-view" v-show="isAdmin"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import {authenticationStore} from "@/store/authentication";

  export default {
    name:"AppBar",
    components:{},
    data(){
      return {
        authenticationStore: authenticationStore(),
        showDrawer: true,
      }
    },
    computed: {
      miniVariant() {
        return this.$vuetify.display.mdAndUp;
      },
      user() {
        if(this.authenticationStore.authenticationStatus === 'AUTHENTICATED'){
          return {
            name: this.authenticationStore.authenticatedUser.data.name,
            role: this.authenticationStore.authenticatedUser.data.role
          }
        }
        return {
          name:'',
          role:''
        }
      },
      isAdmin(){
        if(this.authenticationStore.authenticationStatus === 'AUTHENTICATED') {
          if (this.authenticationStore.authenticatedUser.data.role === 'ADMINISTRATOR') {
            return true;
          }
        }
        return false;
      },
    },
    methods:{
      myData(){
        this.$router.push({name:'my-data'});
      }
    }
  }
</script>
