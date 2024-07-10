<template>
  <draggable-dialog
    class="serialMonitor"
    identifier="serialMonitor"
    v-show="showMonitorSerial"
    v-on:closeEvent="closeSerialMonitor"
    v-on:onDialogFocus="onDialogFocus"
    :dialogFocus="dialogFocus"
    title="Monitor Serial">
    <v-container :fluid="true">
      <v-row>
        <v-text-field
          :onkeyup="txSerialKeyHandler"
          class="text-wrap"
          v-model="txData"
          label="Enviar dados"
          filled
          :append-icon="'mdi-send'"
          @click:append="txSerial"
        ></v-text-field>
      </v-row>

      <v-row>
        <v-card
          id="serialCard"
          class="overflow-y-auto"
          min-height="160"
          max-height="160"
          width="100%"
          dark>
          <v-card-text>
            <div>
              <p v-for="(line,i) in serialData" :key="i">
                {{ line }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-row>

      <v-row>
        <v-btn
          style="margin-top: 10px"
          density="comfortable"
          append-icon="mdi-broom"
          color="primary"
          elevation="2"
          v-on:click="clearSerialMonitor"
        >Limpar
        </v-btn>
      </v-row>
    </v-container>
  </draggable-dialog>

  <draggable-dialog
    identifier="camera"
    v-show="showCamera"
    v-on:closeEvent="closeCameraDialog"
    v-on:onDialogFocus="onDialogFocus"
    :dialogFocus="dialogFocus"
    title="Câmera" >
    <v-row style="position:relative">
      <video id="remoteVideo" autoplay="" :height="videoHeight" playsinline :controls="!showJoystick" style="border-style: solid; border-width: thin;"/>
      <nipple-joystick v-show="showJoystick" v-on:start="joyStickStart" v-on:end="joyStickStop" v-on:move="joyStickMove" ></nipple-joystick>
      <joy-button v-show="showJoystick" label="A" style="bottom: 10px; right: 70px" v-on:fire="joyButtonFire('A')"></joy-button>
      <joy-button v-show="showJoystick" label="B" style="bottom: 10px; right: 10px" v-on:fire="joyButtonFire('B')"></joy-button>
    </v-row>

    <v-row >
      <v-btn
        :icon="true"
        style="margin: 10px"
        @click="showJoystick = !showJoystick">
        <v-icon>
          mdi-gamepad-variant-outline
        </v-icon>
        <v-tooltip activator="parent" location="bottom">
          <div v-show="showJoystick"> Desativar joystick</div>
          <div v-show="!showJoystick"> Ativar joystick</div>
        </v-tooltip>
      </v-btn>

      <v-btn
        :icon="true"
        style="margin: 10px"
        @click="initWebRTC">
        <v-icon>
          mdi-restart
        </v-icon>
        <v-tooltip activator="parent" location="bottom">
          Reiniciar conexão da câmera
        </v-tooltip>
      </v-btn>
    </v-row>
  </draggable-dialog>

  <code-file-explorer :showFileExplorer="showFileExplorer" v-on:on-open-file="openFile" v-on:on-file-name-update="fileNameUpdate" v-on:on-close="showFileExplorer = false"/>

  <v-container :fluid="true">
    <v-row>
      <v-col cols="12" class="pb-0 pt-2">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              append-icon="mdi-menu-down"
              density="comfortable"
              color="primary"
              dark
              v-bind="props">
              Arquivo
            </v-btn>
          </template>
          <v-list density="compact" :nav="true">
            <v-list-item v-on:click="newFile" prepend-icon="mdi-file-outline" title="Novo"/>
            <v-list-item v-on:click="updateCode" prepend-icon="mdi-content-save-outline" title="Salvar"/>
            <v-list-item v-on:click="openFilesDialog" prepend-icon="mdi-code-braces" title="Meus códigos"/>
          </v-list>
        </v-menu>

        <v-btn
          variant="text"
          :disabled="deviceState !== 'ON_LINE' || localServerState !== 'ON_LINE'"
          append-icon="mdi-cloud-upload"
          density="comfortable"
          color="primary"
          v-on:click="upload">
          Upload
        </v-btn>

        <v-btn
          variant="text"
          :disabled="deviceState !== 'ON_LINE'"
          append-icon="mdi-play"
          density="comfortable"
          color="primary"
          v-on:click="startArduinoTask">
          Iniciar
        </v-btn>

        <v-btn
          variant="text"
          :disabled="deviceState !== 'ON_LINE'"
          append-icon="mdi-stop"
          density="comfortable"
          color="primary"
          v-on:click="restartDevice">
          Parar
        </v-btn>

        <v-btn
          variant="text"
          :disabled="showCamera"
          append-icon="mdi-camera"
          density="comfortable"
          color="primary"
          v-on:click="openCameraDialog">
          Câmera
        </v-btn>

        <v-btn
          variant="text"
          :disabled="showMonitorSerial"
          append-icon="mdi-tab-search"
          density="comfortable"
          class="ma-1"
          color="primary"
          v-on:click="openSerialMonitor">
          Serial
        </v-btn>

        <v-chip  tooltip="Estado do dispositivo" density="comfortable" variant="tonal" >
          Dispositivo
          <v-icon v-show="deviceState === 'ON_LINE'" color="green">mdi-circle-medium</v-icon>
          <v-icon v-show="deviceState === 'OFF_LINE'" color="red">mdi-circle-medium</v-icon>
          <v-icon v-show="deviceState === 'RESTART'" color="orange">mdi-circle-medium</v-icon>
          <v-tooltip activator="parent" location="bottom">
            <div v-show="deviceState === 'ON_LINE'"> Dispostivo on-line</div>
            <div v-show="deviceState === 'OFF_LINE'"> Dispositivo off-line</div>
            <div v-show="deviceState === 'RESTART'"> Dispositivo reiniciando</div>
          </v-tooltip>
        </v-chip>

        <v-chip class="ma-1"  density="comfortable" variant="tonal" >
          Servidor Local
          <v-icon v-show="localServerState === 'ON_LINE'" color="green">mdi-circle-medium</v-icon>
          <v-icon v-show="localServerState === 'OFF_LINE'" color="red">mdi-circle-medium</v-icon>
          <v-tooltip activator="parent" location="bottom">
            <div v-show="localServerState === 'ON_LINE'"> Servidor Local on-line</div>
            <div v-show="localServerState === 'OFF_LINE'"> Servidor Local off-line</div>
          </v-tooltip>
        </v-chip>

        <v-chip class="ma-1" v-show="!timeoutWarning" density="comfortable" variant="tonal" >
          Tempo restante: {{ remainingTime }}
        </v-chip>
        <v-chip class="ma-1 warning" v-show="timeoutWarning" density="comfortable" variant="outlined" color="warning">
          Tempo restante: {{ remainingTime }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="pb-0 pt-1">
        <v-tab color="primary" variant="flat" :ripple="false" class="text-none">{{laboratory.name}} | Arquivo: {{ file.name }}</v-tab>
        <div style="height: 300px; resize: vertical; overflow: auto;">
          <monaco-editor
            class="editor"
            v-model:value="file.content"
            language="cpp"
            :options="optionsMonacoEditor"
            :onresize="resizeCodeEditor"
            :onBeforeMount="onBeforeMountMonacoEditor"
            height="100%"/>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h5>Console Remoto:</h5>
        <v-card
            id="consoleCard"
            class="overflow-y-auto"
            min-height="160"
            max-height="160"
            theme="dark">
          <v-card-text>
            <div>
              <p v-for="(line,i) in hostConsole" :key="i" :style="{whiteSpace:'pre-wrap', color:(line.type==='out'?'white':(line.type==='ok'?'green':'red'))}">
                {{ line.message }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
        v-model="showSaveDialog"
        :persistent = "true"
        width="300">
      <v-card>
        <v-card-title>
          <span class="text-h5">Salvar código</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    :onkeyup="fileNameFieldEnterKeyEvent"
                    v-model="newFileName"
                    label="Nome do arquivo"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue-darken-1"
              variant="text"
              @click="showSaveDialog = false">
            Cancelar
          </v-btn>
          <v-btn
              color="blue-darken-1"
              variant="text"
              @click="saveNewCode(newFileName, (tryingUpload?uploadEvent:null))">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {loadingStore} from "@/store/loading";
  import {authenticationStore} from "@/store/authentication";
  import {notificationStore} from "@/store/notification";

  import MonacoEditor from '@guolao/vue-monaco-editor';
  import DraggableDialog from "@/components/DraggableDialog.vue";
  import CodeFileExplorer from "@/components/CodeFileExplorer.vue";
  import NippleJoystick from "@/components/NippleJoystick.vue";
  import JoyButton from "@/components/JoyButton.vue";

  import {DateTime, Duration} from "luxon";

  import laboratoryService from "@/services/laboratory";
  import codeService from '../services/code';
  import arduinoServices from '../services/arduino';

  import Laboratory from "@/models/Laboratory";
  import Code from "@/models/Code";

  export default {
    name: "LaboratoryInterface",
    props:['id'],
    components: {
      NippleJoystick,
      JoyButton,
      MonacoEditor,
      DraggableDialog,
      CodeFileExplorer
    },
    data() {
      return {
        tryingUpload : false,
        newFileName: null,
        dialogFocus: "",
        authenticationStore: authenticationStore(),
        notificationStore: notificationStore(),
        loadingStore: loadingStore(),
        webSocketURL: 'ws://localhost::5000/',
        socket:{},
        configuration: {
          iceServers: [
            {urls: 'stun:stun.l.google.com:19302'},
            {urls: 'stun:stun1.l.google.com:19302'},
            {urls: 'stun:stun2.l.google.com:19302'},
            {urls: 'stun:stun3.l.google.com:19302'},
            {urls: 'stun:stun4.l.google.com:19302'}
          ],
          iceCandidatePoolSize: 10,
          iceTransportPolicy: "all"
        },
        peerConnection: undefined,
        answer: {},
        offer: {},
        videoHeight: (window.innerHeight > window.innerWidth ? window.innerWidth / 2 : 300),
        laboratory:{},
        showCamera: false,
        showMonitorSerial: false,
        showSaveDialog: false,
        showFileExplorer: false,
        remoteVideo: {},
        remoteStream: {},
        user: {},
        token: '',
        file: new Code(),
        optionsMonacoEditor: {
          automaticLayout: true,
          autoIndent: true,
          mouseWheelZoom: true,
        },
        closedByUser: false,
        hostConsole: [],
        txData: "",
        serialData: [],
        deviceState: 'OFF_LINE',
        localServerState: 'OFF_LINE',
        timerInterval: {},
        remainingTime: "--:--:--",
        now: new Date(),
        reconnectTimeout: {},
        timeoutWarning: false,
        showJoystick:false,
        joystickValue:'off',
        lastJoystickDirection:''
      }
    },
    async created() {
      await this.findLaboratoryById();
      this.user = this.authenticationStore.authenticatedUser.data;
      this.token = this.authenticationStore.authenticatedUser.token;
    },
    async mounted() {
      try{
        document.onkeydown = this.hotkeysEventHandler;
        this.file = await codeService.getLastUserCode(this.id)
      }catch (e) {
        this.newFile();
      }finally {
        await this.initWebSocket();
      }
    },
    async beforeRouteLeave(to, from, next) {
      document.onkeydown = null;
      await clearInterval(this.timerInterval);
      this.closedByUser = true;
      await this.socket.close();
      next();
    },
    methods: {
      resizeCodeEditor(evt){
        console.log(evt);
      },
      fileNameFieldEnterKeyEvent(evt){
        evt.preventDefault();
        switch (evt.key) {
          case 'Enter':
            this.saveNewCode(this.newFileName, (this.tryingUpload? this.uploadEvent:null));
            break;
        }
      },
      async onBeforeMountMonacoEditor(monaco){
        monaco.editor.createModel(arduinoServices.listArduinoMethodes(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoConstants(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoDataTypes(),"cpp");
        monaco.editor.createModel(arduinoServices.listArduinoScopeAndQualifiers(),"cpp");
      },
      async onDialogFocus(dialogIdentificator){
        this.dialogFocus = dialogIdentificator;
      },
      hotkeysEventHandler(evt){
        if(!evt.ctrlKey){
          return;
        }
        switch (evt.key) {
          case 's':
            evt.preventDefault();
            this.updateCode(this.file);
            break;
        }
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
      joyButtonFire(label) {
        if(this.socket.readyState){
          this.socket.send(
            JSON.stringify({
              messageType: "JOYSTICK_COMM",
              role: "USER",
              token: this.token,
              laboratoryId: this.laboratory._id,
              message: `jc:${label}`
            })
          );
        }
      },
      joyStickStart() {

      },
      joyStickStop() {
        this.joystickValue = 'jc:O';
        this.socket.send(
          JSON.stringify({
            messageType: "JOYSTICK_COMM",
            role: "USER",
            token: this.token,
            laboratoryId: this.laboratory._id,
            message: this.joystickValue
          })
        );
      },
      joyStickMove(evt, move) {
        if(move && move.direction) {
          this.lastJoystickDirection = move.direction.angle;
          let comm ="jc:"

          if(move.direction.angle=== 'up'){
            comm+='U'
          }else if (move.direction.angle=== 'down'){
            comm+='D'
          }else if (move.direction.angle === 'left'){
            comm+='L'
          }else{
            comm+='R'
          }
          if (this.joystickValue !== comm) {
            this.joystickValue = comm;
            console.log(this.joystickValue);
            if(this.socket.readyState){
              this.socket.send(
                JSON.stringify({
                  messageType: "JOYSTICK_COMM",
                  role: "USER",
                  token: this.token,
                  laboratoryId: this.laboratory._id,
                  message: this.joystickValue
                })
              );
            }
          }
        }
      },
      newFile() {
        let content = new Laboratory().defaultCode;
        if (this.laboratory.defaultCode) {
          content = this.laboratory.defaultCode
        }
        this.file = {
          _id: null,
          laboratoryId: this.laboratory._id,
          name: "code_" + DateTime.now().toFormat("dd-MM-yy_HH:mm:ss"),
          content: content
        }
        this.newFileName = this.file.name;
      },
      openFile(file){
        this.file = file;
        this.showFileExplorer = false;
      },
      fileNameUpdate(file){
        if(file._id === this.file._id){
          this.file.name = file.name;
        }
      },

      openFilesDialog() {
        this.showFileExplorer = true;
      },
      async updateCode(posEvent) {
        if (this.file._id) {
          try {
            this.loadingStore.loadingStart();
            await codeService.updateCode(this.file);
            this.notificationStore.setSuccessMessages([{msg: "Seu código foi salvo com sucesso."}]);
            if(posEvent){
              await posEvent();
            }
          } catch (e) {
            this.notificationStore.setErrorMessages(e.data.errors);
          }finally {
            this.loadingStore.loadingEnd();
          }
        }else{
          this.showSaveDialog = true;
        }
      },
      async saveNewCode(fileName, posEvent) {
        if(fileName){
          this.file.name = fileName;
        }
        this.loadingStore.loadingStart();
        this.file.laboratoryId = this.laboratory._id;
        try{
          this.file = await codeService.createCode(this.file)
          this.showSaveDialog = false;
          this.notificationStore.setSuccessMessages([{msg: "Seu código foi salvo com sucesso."}]);
          if(posEvent){
            await posEvent();
          }
        }catch (e) {
          this.notificationStore.setErrorMessages(e.data.errors);
        }finally {
          this.loadingStore.loadingEnd();
        }
      },
      async initTimer(timeout) {
        await clearInterval(this.timerInterval);
        let self = this;
        this.timerInterval = setInterval(function () {
          self.remainingTime = Duration.fromObject({seconds: timeout--}).toFormat("hh:mm:ss");
        }, 1000);
      },
      closeCameraDialog() {
        this.showCamera = false;
        this.peerConnection.close();
        this.peerConnection = undefined;
      },
      openCameraDialog() {
        if(!this.showCamera) {
          this.dialogFocus = "camera";
          this.initWebRTC();
          this.showCamera = true;
        }
      },
      openSerialMonitor() {
        this.clearSerialMonitor();
        if(!this.showMonitorSerial) {
          this.dialogFocus = "serialMonitor";
          this.showMonitorSerial = true;
        }
      },
      closeSerialMonitor() {
        this.clearSerialMonitor()
        this.showMonitorSerial = false;
      },
      clearSerialMonitor() {
        this.serialData = [];
      },
      clearOutputConsole() {
        this.hostConsole = [];
      },
      txSerialKeyHandler(evt){
        evt.preventDefault();
        switch (evt.key) {
          case 'Enter':
            this.txSerial();
            break;
        }
      },
      txSerial() {
        this.socket.send(
          JSON.stringify({
            messageType: "TX_SERIAL",
            role: "USER",
            token: this.token,
            laboratoryId: this.laboratory._id,
            message: this.txData
          })
        );
        this.txData = "";
      },
      async uploadEvent(){
        const message = {
          messageType: 'SOURCE_CODE',
          role: "USER",
          token: this.token,
          laboratoryId: this.laboratory._id,
          message: this.file.content
        }
        this.socket.send(JSON.stringify(message));
        this.clearOutputConsole();
        this.tryingUpload = false;
      },
      async upload() {
        this.tryingUpload = true;
        if(this.file._id){
          await this.updateCode(this.uploadEvent);
        }else{
          this.showSaveDialog = true;
        }
      },
      startArduinoTask() {
        this.clearOutputConsole();
        this.pushConsoleData({message:"Iniciando o programa...\n",type:"out"});
        const message = {
          messageType: 'START_ARDUINO_TASK',
          role: "USER",
          token: this.token,
          laboratoryId: this.laboratory._id
        }
        this.socket.send(JSON.stringify(message));
        this.openCameraDialog();
      },
      restartDevice() {
        this.clearOutputConsole();
        this.hostConsole.push({message:"Parando o programa e reiniciando o dispositivo.\n",type:'out'});
        const message = {
          messageType: 'RESTART_DEVICE',
          role: "USER",
          token: this.token,
          laboratoryId: this.laboratory._id
        }
        this.socket.send(JSON.stringify(message));
      },
      async pushConsoleData(data){
        this.hostConsole.push(data);
        const consoleCard = await document.querySelector("#consoleCard");
        consoleCard.scrollTop = consoleCard.scrollHeight;
      },
      async pushSerialMonitorData(data){
        if(this.serialData.length > 100){
          this.serialData.shift();
        }
        let messages = data.message.toString().split("\n");
        for(let i  in messages){
          this.serialData.push(messages[i]);
        }
        let serialCard = document.querySelector("#serialCard");
        if(serialCard) {
          serialCard.scrollTop = serialCard.scrollHeight;
        }
      },
      async reconnect() {
        this.loadingStore.loadingStart();
        this.notificationStore.setWarningMessages( [{msg: "Reconectando..."}]);
        this.reconnectTimeout = setTimeout(this.initWebSocket, 5000);
      },
      async initWebRTC() {
        if(this.peerConnection){
          await this.peerConnection.close();
        }
        this.remoteVideo = await document.querySelector('#remoteVideo');
        this.peerConnection = await new RTCPeerConnection(this.configuration);
        this.remoteStream = await new MediaStream();
        this.remoteVideo.srcObject = this.remoteStream;

        this.peerConnection.onicecandidate = (candidate) => {
          if (candidate.candidate) {
            this.socket.send(JSON.stringify({
              messageType: "CANDIDATE",
              role: "USER",
              token: this.token,
              laboratoryId: this.laboratory._id,
              message: candidate.candidate
            }));
          }
        }

        this.peerConnection.oniceconnectionstatechange = async () =>{
          if (this.peerConnection.iceConnectionState === "failed") {
            console.log("Falha");
            this.peerConnection.restartIce();
          }
        }

        this.peerConnection.ontrack = async (event) => {
          await this.remoteStream.addTrack(event.track, this.remoteStream);
        };

        this.socket.send(JSON.stringify({
          messageType: "REQ_REMOTE_DESCRIPTION",
          userName: this.authenticationStore.authenticatedUser.data.name,
          role: "USER",
          token: this.token,
          laboratoryId: this.laboratory._id
        }));
      },
      async initWebSocket() {
        this.socket = new WebSocket(this.webSocketURL);

        this.socket.onopen = async () => {
          await clearTimeout(this.reconnectTimeout);
          this.loadingStore.loadingEnd();
          this.socket.send(JSON.stringify({
            messageType: "JOIN_LABORATORY",
            role: "USER",
            token: this.token,
            laboratoryId: this.laboratory._id,
          }));
        }

        this.socket.onclose = async () => {
          if (!this.closedByUser) {
            await this.socket.close();
            await this.reconnect();
          }
        }

        this.socket.onerror = async () => {
          //TODO: Salvar código localmente em caso de erro.
        }

        this.socket.onmessage = async (msg) => {
          const data = JSON.parse(msg.data);
          switch (data.messageType) {
            case 'JOIN_LABORATORY_OK':
              this.loadingStore.loadingEnd();
              await clearInterval(this.timerInterval);
              await this.initTimer(data.message);
              break;

            case 'REQ_REMOTE_DESCRIPTION':
              this.offer = await this.peerConnection.createOffer();
              await this.peerConnection.setLocalDescription(this.offer);
              this.socket.send(
                JSON.stringify({
                  messageType: "OFFER",
                  role: "USER",
                  token: this.token,
                  laboratoryId: this.laboratory._id,
                  message: this.offer
                })
              );
              break;

            case 'OFFER':
              await this.peerConnection.setRemoteDescription(data.message);
              this.answer = await this.peerConnection.createAnswer();
              await this.peerConnection.setLocalDescription(this.answer);
              this.socket.send(
                JSON.stringify({
                  messageType: "ANSWER",
                  role: "USER",
                  token: this.token,
                  laboratoryId: this.laboratory._id,
                  message: this.answer
                })
              );
              break;

            case 'CANDIDATE':
              if (!this.peerConnection) {
                return;
              }
              await this.peerConnection.addIceCandidate(data.message);
              break;

            case 'OUTPUT_CONSOLE':
              await this.pushConsoleData(data);
              break;

            case 'RX_SERIAL':
              await this.pushSerialMonitorData(data);
              break;

            case 'START_ARDUINO_TASK_OK':
              await this.pushConsoleData({message:"Programa em execução.\n",type:"ok"});
              break;

            case 'DEVICE_STATE':
              this.deviceState = data.message.toString();
              break;

            case 'LOCAL_SERVER_STATE':
              this.localServerState = data.message.toString();
              break;

            case 'TIMEOUT_WARNING':
              this.timeoutWarning = true;
              this.notificationStore.setWarningMessages([{msg: "Tempo restante: " + this.remainingTime + "."}, {msg: "Seu código será salvo automáticamente."}]);
              break;

            case 'LABORATORY_TIMEOUT':
              if(!this.file.name){
                this.file.name = "code_" + DateTime.now().toFormat("dd-MM-yy_HH:mm:ss");
              }
              if (this.file._id) {
                try{
                  this.closedByUser = true;
                  await codeService.updateCode(this.file);
                  this.notificationStore.setSuccessMessages( [{msg: "Seu código foi salvo automaticamente."}]);
                }catch (e) {
                  this.notificationStore.setErrorMessages([{msg: "Problema ao salvar o seu código."}]);
                }
              } else {
                try{
                  await codeService.createCode(this.file);
                  this.notificationStore.setSuccessMessages( [{msg: "Seu código foi salvo automaticamente."}]);
                }catch (e) {
                  this.notificationStore.setErrorMessages([{msg: "Problema ao salvar o seu código."}]);
                }
              }
              await this.$router.push({name: 'laboratories'});
              break;

            case 'LABORATORY_IN_MAINTENANCE':
              this.closedByUser = true;
              this.notificationStore.setWarningMessages( [{msg: "Laboratório em manutenção."}]);
              await this.$router.push({name: 'laboratories'});
              break;

            case 'LABORATORY_IN_USE':
              this.closedByUser = true;
              this.notificationStore.setWarningMessages( [{msg: "Laboratório em uso."}]);
              await this.$router.push({name: 'laboratories'});
              break;

            case 'CHANGE_WEBSOCKET_CONNECTION':
              this.closedByUser = true;
              this.notificationStore.setWarningMessages( [{msg: "Você se conectou por outra interface."}]);
              await this.$router.push({name: 'laboratories'});
              break;

            case 'ERROR_MESSAGE':
              this.closedByUser = true;
              await this.$router.push({name: 'laboratories'});
              break;

            case 'NEW_CAMERA_STREAM':
              if(this.showCamera){
                await this.initWebRTC();
              }
              break;
          }
        }
      }
    }
  }
</script>

<style scoped>
  .editor {
    border-style: solid;
    border-width: thin;
    border-color: gainsboro;
  }

  .serialMonitor{
    width:410px;
  }

  @media (max-device-width: 600px) {
    .serialMonitor{
      width:90vw;
    }
  }
</style>
