<script setup>
import { useRoute } from 'vue-router'
import KitDetails from '@/components/Kits/KitDetails.vue'

let route = useRoute();

</script>

<template>
  <Suspense>
    <KitDetails :key="$route.params.id"/>
  </Suspense>
</template>
