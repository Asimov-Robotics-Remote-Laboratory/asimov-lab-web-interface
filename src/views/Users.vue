<template>
  <div>
    <v-card flat>
      <template v-slot:prepend>
        <v-card-title>
          <h3>
            Usuários
          </h3>
        </v-card-title>
      </template>

      <template v-slot:append>
        <v-btn
          class="ma-2"
          color="indigo"
          v-on:click="createNewUser"
          dark>
          Novo Usuário
        </v-btn>
      </template>

      <v-divider></v-divider>

      <v-card-text>
        <v-data-table-server
          v-model="selectedUsers"
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :loading="loading"
          :headers="headers"
          :items-length="totalItems"
          :items="users"
          :items-per-page-options = "[5,10,20,30,40,50]"
          items-per-page-text = "Itens por página"
          @update:options="listUsersByPage">

          <template v-slot:top>
            <v-text-field
              v-model="search"
              v-on:keyup="find"
              label="Busca (Nome ou E-mail)"
              class="pa-2"
            ></v-text-field>
          </template>

          <template v-slot:[`item.creationDate`]="{ item }">
              {{formatDate(item.creationDate)}}
          </template>

          <template v-slot:[`item.role`]="{ item }">
              {{formatRole(item.role)}}
          </template>

          <template v-slot:[`item.active`]="{ item }">
              {{item.active?'Ativo':'Desativado'}}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              v-on:click="editUser(item._id)">
              mdi-pencil
            </v-icon>
            <v-icon
              small
              v-on:click="removeUser(item._id)">
              mdi-delete-outline
            </v-icon>
          </template>

        </v-data-table-server>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {notificationStore} from "@/store/notification";
  import userService from '@/services/user';
  import {DateTime} from "luxon";
  export default {
    name: "UsersList",

    data() {
      return {
        notificationStore: notificationStore(),
        loading: false,
        search:'',
        page:1,
        itemsPerPage: 5,
        totalItems: 0,
        users: [],
        selectedUsers: [],
        headers: [
          {
            title: 'Nome:',
            align: 'left',
            sortable: true,
            value: 'name',
          },
          {
            title: 'E-mail',
            value: 'email',
            sortable: true
          },
          {
            title: 'Papel',
            value: 'role',
            sortable: true
          },
          {
            title: 'Data de criação',
            value: 'creationDate',
            sortable: true
          },
          {
            title: 'Ações',
            value: 'actions',
          },
        ],
      }
    },
    mounted() {
      this.listUsersByPage();
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
      async find(){
        if(this.search.length < 1){
           await this.listUsersByPage();
        }else {
          try {
            this.loading = true;
            const data = await userService.findUsersByNameOrEmail(this.page, this.itemsPerPage, this.search);
            this.users = data.users;
            this.totalItems = data.totalItems;
            this.loading = false;
          } catch (e) {
            this.loading = false;
            this.notificationStore.setErrorMessages(e.data.errors);
          }
        }
      },
      async listUsersByPage() {
        try{
          this.loading = true;
          const data = await userService.listUsersByPage(this.page, this.itemsPerPage);
          this.users = data.users;
          this.totalItems = data.totalItems;
          this.loading = false;
        }catch (e) {
          this.loading = false;
          this.notificationStore.setErrorMessages(e.data.errors);
        }
      },
      createNewUser() {
        this.$router.push({name: 'user-form'})
      },
      editUser(id) {
        this.$router.push({name: 'user-form', params: {id}});
      },
      async removeUser(id) {
        try {
          this.loading = true;
          await userService.removeUser(id);
          this.loading = false;
          this.notificationStore.setSuccessMessages([{msg:"Usuário removido com sucesso."}]);
          this.listUsersByPage();
        }catch(e){
          this.loading = false;
          this.notificationStore.setErrorMessages(e.data.errors);
        }
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
