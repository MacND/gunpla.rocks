<script setup>
import RecentlyAddedKits from '@/components/Home/RecentlyAddedKits.vue'
import RecentPosts from '@/components/Blog/RecentPosts.vue';
</script>

<template>
  <v-img src="https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/cdn/biglogo@1x.png" class="mx-auto mt-4" :width="400" max-width="90%"></v-img>
  <RecentlyAddedKits />
  <RecentPosts />
</template>
