<template>
    <v-dialog v-model="loading" fullscreen transition="false" scrim="rgba(100, 100, 100, 0.50)" >
      <v-row justify="center" align="center">
          <v-progress-circular
            :size="100"
            :width="12"
            indeterminate
            color="primary">
          </v-progress-circular>
      </v-row>
    </v-dialog>
</template>

<script>
    import {loadingStore} from "@/store/loading";
    export default {
        name: "LoadingScreen",
        data(){
          return{
            loadingStore: loadingStore()
          }
        },
        computed: {
            loading() {
              //return true;
              return this.loadingStore.loadingStatus
            }
        }
    }
</script>

<style scoped>

</style>
