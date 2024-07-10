<template>
  <v-dialog v-model="codeFileExplorerModel" transition="dialog-bottom-transition" :scrim="true">
    <v-card class="overflow-hidden">
      <v-toolbar
        dark
        color="primary">
        <v-btn
          icon="mdi-close"
          dark
          @click="close">
        </v-btn>
        <v-toolbar-title>Meus Códigos</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-row class="pa-5">
        <v-col cols="4">
          <v-virtual-scroll
            :items="files"
            height="400"
            item-height="60">
            <template v-slot:default="{item}">
              <v-list-item prepend-icon="mdi-file" :key="item._id" @click="selectFile(item)" :title="item.name">
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-col>
        <v-divider vertical></v-divider>

        <div
          v-if="!selectedFile"
          class="text-h6 grey--text text--lighten-1 font-weight-light"
          style="margin-left: 20px">
          Selecione um arquivo.
        </div>

        <v-card
          v-else
          width="50%"
          :key="selectedFile._id"
          flat>
          <v-card-text>
            <monaco-editor language="cpp" :options="optionsFileView" v-model:value="selectedFile.content"
                           style="width: 100%; height: 200px; border-style: solid; ">
            </monaco-editor>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            <h3 v-show="!isEditingFileName" class="text-h6 mb-2">
              {{ selectedFile.name }}
              <v-btn
                density="comfortable"
                variant="text"
                icon="mdi-pencil"
                @click="openFileNameEditTextField(selectedFile)"
              ></v-btn>
            </h3>

            <div v-show="isEditingFileName">
              <v-text-field
                label="Título"
                type="text"
                outlined
                dense
                :onkeyup="fileNameFieldEnterKeyEvent"
                v-model="fileName">
              </v-text-field>
            </div>

            <div v-show="isEditingFileName">
              <v-btn class="ma-1"
                     color="primary"
                     elevation="2"
                     append-icon="mdi-check"
                     @click="updateFileName"
                     small>
                Salvar
              </v-btn>
              <v-btn class="ma-1"
                     append-icon="mdi-cancel"
                     color="warning"
                     elevation="2"
                     @click="cancelFileNameEdition"
                     small>
                Cancelar
              </v-btn>
            </div>

            <div v-show="!isEditingFileName">
              <v-btn class="ma-1"
                     color="primary"
                     elevation="2"
                     append-icon="mdi-open-in-app"
                     @click="openFile"
                     small>
                Abrir
              </v-btn>
              <v-btn class="ma-1"
                     color="red"
                     append-icon="mdi-delete"
                     elevation="2"
                     @click="removeFile"
                     small>
                Remover
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import MonacoEditor from '@guolao/vue-monaco-editor';
import {loadingStore} from "@/store/loading";
import {authenticationStore} from "@/store/authentication";
import {notificationStore} from "@/store/notification";
import codeService from "@/services/code";
export default {
  props:['userId', 'showFileExplorer'],
  emits:['onOpenFile','onClose', 'onFileNameUpdate'],
  components:{
    MonacoEditor
  },
  data(){
    return{
      authenticationStore: authenticationStore(),
      notificationStore: notificationStore(),
      loadingStore: loadingStore(),
      optionsFileView: {
        automaticLayout: true,
        readOnly: true,
        mouseWheelZoom: true,
        minimap: {enabled: false}
      },
      selectedFile:null,
      files: [],
      fileName:"",
      isEditingFileName: false,
    }
  },
  computed:{
    codeFileExplorerModel(){
      if(this.showFileExplorer){
        this.listUserCodes();
      }
      return this.showFileExplorer;
    }
  },
  methods:{
    fileNameFieldEnterKeyEvent(evt){
      evt.preventDefault();
      switch (evt.key) {
        case 'Enter':
          this.updateFileName();
          break;
      }
    },
    async close(){
      this.$emit('onClose');
    },
    async listUserCodes() {
      this.selectedFile = null;
      try{
        this.loadingStore.loadingStart();
        this.files = await codeService.listUserCodes();
      }catch (e) {
        this.notificationStore.setErrorMessages(e.data.errors);
      }finally {
        this.loadingStore.loadingEnd();
      }
    },
    async selectFile(file) {
      this.isEditingFileName = false;
      this.fileName = "";
      this.selectedFile = file;
    },
    async openFile() {
      this.$emit('onOpenFile', this.selectedFile);
    },
    async openFileNameEditTextField (){
      this.fileName = this.selectedFile.name;
      this.isEditingFileName = true;
    },
    async cancelFileNameEdition() {
      this.fileName = ""
      this.isEditingFileName = false;
    },
    async updateFileName() {
      try {
        this.loadingStore.loadingStart();
        this.selectedFile.name = this.fileName;
        await codeService.updateCode(this.selectedFile);
        await this.$emit('onFileNameChange', this.selectedFile);
        this.notificationStore.setSuccessMessages([{msg: "Seu código foi salvo com sucesso."}]);
        this.fileName = "";
        this.isEditingFileName = false;
      } catch (e) {
        this.notificationStore.setErrorMessages(e.data.errors);
      }finally {
        this.loadingStore.loadingEnd();
      }
    },
    async removeFile() {
      try{
        this.loadingStore.loadingStart();
        await codeService.removerCode(this.selectedFile._id);
        this.listUserCodes();
        this.notificationStore.setSuccessMessages([{msg: "Código removido com sucesso."}]);
      }catch (e) {
        this.notificationStore.setErrorMessages(e.data.errors);
      }
    },
  }
}
</script>

<style scoped>

</style>
