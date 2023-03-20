<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/Navbar.vue'
</script>

<script>
export default {
  computed: { 
    route: () => useRoute() 
  }
}
</script>

<template>
  <v-app>
      <NavBar />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
