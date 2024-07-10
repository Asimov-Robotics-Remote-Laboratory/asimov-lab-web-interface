<template>
  <app-notification/>
  <loading/>
  <router-view/>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import AppNotification from "@/components/AppNotification.vue";
</script>
