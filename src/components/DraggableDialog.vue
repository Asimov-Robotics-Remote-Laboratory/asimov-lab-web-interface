<template>
    <v-card :id="identifier"
            :style="{zIndex:zIndex}"
            :ripple="false"
            v-show="showDialog"
            class="my-dialog overflow-hidden">
      <div v-on:click="clicked">
      <v-toolbar style="cursor: move;" :draggable="draggable" :id="identifier+'Toolbar'" dark color="primary"
                 v-on:click="clicked"
                 v-on:dragstart="dragStart"
                 v-on:dragover="dragover"
                 v-on:drag="drag"
                 v-on:dragend="drag"
                 v-on:touchstart="touchStart"
                 v-on:touchmove="touchMove">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <slot></slot>
      </v-container>
      </div>
    </v-card>
</template>

<script>
export default {
  name:"DraggableDialog",
  props: ['identifier','title', 'show', 'minWidth','maxWidth', 'minHeigth','maxHeigth', "height", "width","dialogFocus"],
  events:['onDialogFocus'],
  data(){
    return{
      draggable:true,
      element:[],
      showDialog: this.show,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
      style:{
        width: this.width
      }
    }
  },
  computed:{
    zIndex: function(){
      return this.dialogFocus === this.identifier? 2000:1000;
    }
  },
  mounted() {
    this.element = document.querySelector("#"+this.identifier);
    this.element.style.top = "10%";
    this.element.style.left = "10%";
  },
  methods:{
    async clicked(){
      await this.emitFocusValue();
    },
    async emitFocusValue(){
      await this.$emit('onDialogFocus', this.identifier);
      if(this.dialogFocus === this.identifier){
        this.style.zIndex = 2000;
      }
    },
    closeDialog(){
      this.showDialog = false;
      this.$emit('closeEvent');
    },
    async dragStart(e){
      await this.emitFocusValue();
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
    },
    async dragover(e){
      e.preventDefault();
    },
    async drag(e){
      e.preventDefault();
      this.element = document.querySelector("#"+this.identifier);
      if(!this.draggable){
        return;
      }

      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;

      this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
      this.element.style.left =  (this.element.offsetLeft - this.pos1) + "px";
    },
    async touchStart(e){
      await this.emitFocusValue();
      this.pos3 = e.touches[0].clientX;
      this.pos4 = e.touches[0].clientY;
    },
    async touchMove(e){
      e.preventDefault();
      this.element = document.querySelector("#"+this.identifier);
      if(!this.draggable){
        return;
      }
      this.pos1 = this.pos3 -  e.changedTouches[0].clientX;
      this.pos2 = this.pos4 - e.changedTouches[0].clientY;
      this.pos3 =  e.changedTouches[0].clientX;
      this.pos4 = e.changedTouches[0].clientY;

      this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
      this.element.style.left =  (this.element.offsetLeft - this.pos1) + "px";
    }
  }
}
</script>

<style scoped>
.my-dialog{
  position: absolute;
}
</style>
