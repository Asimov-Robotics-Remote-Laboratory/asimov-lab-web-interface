<template>
  <div class="nipple-joystick">

  </div>
</template>

<script >
  import nipplejs from "nipplejs";
  export default {
    name:"NippleJoystick",
    data(){
      return{
        joystick:{}
      }
    },
    async mounted() {
     this.joystick = await nipplejs.create({
        zone: document.querySelector('.nipple-joystick'),
        mode: 'static',
        dynamicPage: true,
        position: { left: '50%', top: '50%' },
        color: 'blue',
        threshold: 0.25,
        fadeTime: 400,
        maxNumberOfNipples: 1,
        restOpacity: 0.70,
      })
      let that = this;
      this.joystick.on('start', function (evt, data) {
        that.$emit('start',evt,data);
      });
      this.joystick.on('end', function (evt, data) {
        that.$emit('end',evt,data);
      });
      this.joystick.on('move', function (evt, data) {
        that.$emit('move',evt,data);
      });
    }
  }
</script>

<style scoped>
.nipple-joystick{
  position: absolute;
  bottom: 60px;
  left: 60px;
}
</style>
