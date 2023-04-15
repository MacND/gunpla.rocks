<script setup>

import { useRoute } from 'vue-router'
import KitList from '@/components/Kits/KitList.vue'

let route = useRoute();
</script>

<template>
  <KitList />
</template>

