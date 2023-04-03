<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/Navbar.vue'
import { onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  supabase.auth.onAuthStateChange((_, _session) => {
    authStore.currentSession = _session
  })
})
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

<style>
.v-tooltip .v-overlay__content {
    background: rgba(var(--v-theme-surface-variant), 1) !important;
}
</style>