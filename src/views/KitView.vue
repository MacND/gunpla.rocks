<script setup>
import { useRoute } from 'vue-router'
import KitDetails from '@/components/KitDetails.vue'
import Kits from '@/components/Kits.vue'

let route = useRoute();

</script>

<template>

    <KitDetails :key="$route.params.id" v-if="route.params.id"/>
    <Kits v-else />

</template>
