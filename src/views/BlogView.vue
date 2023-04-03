<script setup>
import { useRoute } from 'vue-router'
import RecentPosts from '@/components/Blog/RecentPosts.vue';
import BlogPost from '@/components/Blog/BlogPost.vue';

let route = useRoute();
</script>

<template>
  <BlogPost :key="$route.params.id" v-if="route.params.id"/>
  <RecentPosts v-else />
</template>
