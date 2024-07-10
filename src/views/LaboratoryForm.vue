<template>
  <div>
    <v-card :loading="loading" flat>
      <v-card-title>
          Experimento
      </v-card-title>

      <v-card-subtitle>
        {{ title }}
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" >
          <v-text-field
            label="Nome"
            type="text"
            outlined
            dense
            v-model="laboratory.name">
          </v-text-field>
          <v-text-field
            label="Descrição"
            type="text"
            outlined
            dense
            v-model="laboratory.description">
          </v-text-field>
          <v-text-field
            label="Link de imagem"
            type="text"
            outlined
            dense
            v-model="laboratory.imageLink">
          </v-text-field>
          Código padrão:
          <monaco-editor language="cpp" :options="options" v-model:value="laboratory.defaultCode" :onBeforeMount="onBeforeMountMonacoEditor" style="width: 100%; height: 200px; border-style: solid; border-width: thin;  margin-bottom: 20px">

          </monaco-editor>
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
  import laboratoryService from '../services/laboratory';
  import MonacoEditor from '@guolao/vue-monaco-editor';
  import Laboratory from "@/models/Laboratory";
  import arduinoServices from "@/services/arduino";

  export default {
    name: "LaboratoryForm",
    props: ['id'],
    components: {
      MonacoEditor
    },
    data() {
      return {
        notificationStore: notificationStore(),
        title: (this.id ? "Editar Laboratório" : "Novo Laboratório"),
        loading: false,
        laboratory: new Laboratory(),
        options:{
          automaticLayout: true,
          autoIndent: true,
          mouseWheelZoom: true,
        },
      }
    },
    mounted() {
      if(this.id){
        this.findLaboratoryById();
      }
    },
    methods: {
      async onBeforeMountMonacoEditor(monaco){
        monaco.editor.createModel(arduinoServices.listArduinoMethodes(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoConstants(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoDataTypes(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoScopeAndQualifiers(),"cpp");
      },
      async findLaboratoryById(){
        try{
          this.loading = true;
          const id = this.id;
          this.laboratory = await laboratoryService.findLaboratoryById(id);
          this.laboratory.id = this.laboratory._id;
          this.loading = false;
        }catch (response){
          const errors = response.data.errors;
          this.loading = false;
          this.notificationStore.setErrorMessages(errors);
          this.$router.push({name:"laboratories"});
        }
      },
      async save() {
        this.loading = true;
        if(this.laboratory._id){
          try {
            await laboratoryService.updateLaboratory(this.laboratory);
            this.$router.push({name:"laboratories"});
            this.loading = false;
            this.notificationStore.setSuccessMessages([{msg: "Laboratório atualizado com sucesso!"}]);
          }catch (response) {
            this.loading = false;
            this.notificationStore.setErrorMessages(response.data.errors);
          }
        } else {
          try {
            await laboratoryService.createLaboratory(this.laboratory);
            this.$router.push({name:"laboratories"});
            this.loading = false;
            this.notificationStore.setSuccessMessages([{msg: "Laboratório inserido com sucesso!"}]);
          }catch (response) {
            this.loading = false;
            this.notificationStore.setErrorMessages(response.data.errors);
          }
        }
      },
      cancel() {
          this.$router.push({name:"laboratories"});
      }
    }
  }
</script>

<style scoped>

</style>
