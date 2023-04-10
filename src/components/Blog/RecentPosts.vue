<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const posts = ref([]);

async function getRecentPosts() {
  const { data, error } = await supabase
    .from('blog_posts_view')
    .select('*')
    .limit(3)

  if (error) throw error

  posts.value = data
}

onMounted(() => {
  getRecentPosts();
})
</script>

<template>
  <v-container>
    <v-breadcrumbs :items="[{ title: 'Blog', href: '/blog' }]"></v-breadcrumbs>
    <v-card color="grey-darken-3" v-if="posts">
      <v-list lines="one" density="compact" >
        <v-list-subheader class="text-overline">Recent Blog Posts</v-list-subheader>
      </v-list>
      <v-divider></v-divider>
      <v-list lines="two">
        <v-list-item v-for="post in posts" 
          :key="post.id" 
          :title="post.title + ' - by ' + post.full_name"
          :subtitle="dayjs().to(dayjs(post.created_at))"
          :prepend-avatar="post.avatar_url" 
          :to="{name: 'blog', params: { id: post.id } }" >
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>