<script setup>
import RecentlyAddedKits from '@/components/Home/RecentlyAddedKits.vue'
import RecentPosts from '@/components/Blog/RecentPosts.vue';
</script>

<template>
  <v-img src="https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/cdn/biglogo@4x.png" class="mx-auto mx-4 my-2" :width="400"></v-img>
  <RecentlyAddedKits />
  <RecentPosts />
</template>
