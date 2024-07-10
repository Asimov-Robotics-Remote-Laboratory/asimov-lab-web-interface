<template>
    <div>
        <v-card :loading="loading" flat>
                <v-card-title>
                    Usuário
                </v-card-title>

                <v-card-subtitle>
                  {{ title }}
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field
                                label="Nome"
                                type="text"
                                outlined
                                dense
                                v-model="user.name">
                        </v-text-field>

                        <v-text-field
                                label="E-mail"
                                type="text"
                                outlined
                                dense
                                v-model="user.email">
                        </v-text-field>

                        <v-combobox
                            v-model="user.role"
                            :items="roles"
                            label="Papel"
                            dense
                            outlined
                        ></v-combobox>

                        <v-text-field
                                label="Senha"
                                type="password"
                                outlined
                                dense
                                v-model="user.password">
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
  import {notificationStore} from "@/store/notification";
  import userService from '../services/user';
  import User from "@/models/User";

  export default {
    name: "UserForm",
    props: ['id'],
    data() {
      return {
        notificationStore: notificationStore(),
        roles:['ADMINISTRATOR','USER'],
        title: (this.id ? "Editar Usuário" : "Novo Usuário"),
        loading: false,
        user: new User(),
      }
    },
    mounted() {
      if(this.id){
        this.findUserById();
      }
    },
    methods: {
      async findUserById(){
        try{
          this.loading = true;
          const id = this.id;
          this.user = await userService.findUserById(id);
          this.user.id = this.user._id;
          this.loading = false;
        }catch (response){
          const errors = response.data.errors;
          this.loading = false;
          this.notificationStore.setErrorMessages(errors);
          this.$router.push({name:"users"});
        }
      },
      async save() {
        this.loading = true;
        if(this.user._id){
          try {
            await userService.updateUser(this.user);
            this.$router.push({name:"users"});
            this.loading = false;
            this.notificationStore.setSuccessMessages([{msg: "Usuário atualizado com sucesso!"}]);
          }catch (response) {
            this.loading = false;
            this.notificationStore.setErrorMessages(response.data.errors);
          }
        } else {
          try {
            await userService.createUser(this.user);
            this.$router.push({name:"users"});
            this.loading = false;
            this.notificationStore.setSuccessMessages([{msg: "Usuário inserido com sucesso!"}]);
          }catch (response) {
            this.loading = false;
            this.notificationStore.setErrorMessages(response.data.errors);
          }
        }
      },
      cancel() {
        this.$router.push({name:"users"});
      }
    }
  }
</script>

<style scoped>

</style>
