<template>
  <div class="joy-button" :onclick="onClick">
    <p>{{label}}</p>
  </div>
</template>

<script>

export  default {
  emits:['fire'],
  props:['label'],
  methods:{
    onClick(){
      this.$emit('fire',this.label);
    }
  }
}
</script>

<style scoped>
.joy-button{
  vertical-align: center;
  width: 50px;
  height: 50px;
  opacity: 50%;
  background-color: blue;
  border-style: none;
  border-radius: 50%;
  position: absolute;
}

.joy-button p{
  font-weight: bold;
  user-select: none;
  padding-top: 25%;
  vertical-align: center;
  text-align: center;
  display: block;
  color: white;
  background-color: transparent;
  opacity: 100%;
}

.joy-button:active {
  background-color: #00009b;
}
</style>
