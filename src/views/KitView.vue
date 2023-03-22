<script setup>
import { useRoute } from 'vue-router'
import KitDetails from '@/components/Kits/KitDetails.vue'
import Kits from '@/components/Kits/KitList.vue'

let route = useRoute();
</script>

<template>
  <KitDetails :key="$route.params.id" v-if="route.params.id"/>
  <Kits v-else />
</template>
