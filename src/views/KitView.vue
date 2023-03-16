<script setup>
import { useRoute } from 'vue-router'
import KitDetails from '@/components/KitDetails.vue'
import Kits from '@/components/Kits.vue'

let route = useRoute();

</script>

<template>
  <Suspense>
    <KitDetails :key="$route.params.id" v-if="route.params.id"/>
    <Kits v-else />
  </Suspense>

  <!-- <v-img src="https://pbs.twimg.com/media/Fqf9RUkXsAUkKdD?format=jpg&name=large"></v-img> -->
</template>
