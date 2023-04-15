<script setup>
import { useRoute } from 'vue-router'
import CollectionList from '@/components/Collection/CollectionList.vue'

let route = useRoute();
</script>

<template>
  <CollectionList :key="$route.params.username"/>
</template>
