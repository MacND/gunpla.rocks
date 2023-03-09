<script setup>
import { useRoute } from 'vue-router'
import KitDetails from '@/components/KitDetails.vue'
import Kits from '@/components/Kits.vue'

const route = useRoute();
// const id = route.params.id;

</script>

<template>
  <Suspense>
    <KitDetails v-if="route.params.id"/>
    <Kits v-else />
  </Suspense>

  <!-- <v-img src="https://pbs.twimg.com/media/Fqf9RUkXsAUkKdD?format=jpg&name=large"></v-img> -->
</template>
