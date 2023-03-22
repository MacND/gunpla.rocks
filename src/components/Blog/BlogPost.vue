<script setup>
import { supabase } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const route = useRoute();
const postID = route.params.id;
const blogPost = ref();

async function getBlogPostByID(id) {
  try {
    const { data, error } = await supabase
      .from('blog_posts_view')
      .select('*')
      .eq('id', id)
      .limit(1)

    if (error) throw error

    blogPost.value = await data.pop();
    document.title = `${blogPost.value.title} - gunpla.rocks`

  } catch (error) {
    console.log(error.message)
  }
}

onMounted(() => {
  getBlogPostByID(postID);
});
</script>

<template>
  <v-container v-if="blogPost" class="d-flex flex-wrap justify-center">
    <v-card class="justify-center" color="indigo-darken-1" variant="outlined">
      <v-card color="grey-darken-4">
        <v-row no-gutters>
          <v-col cols="1" flex-column align-self="center" class="d-flex justify-center pl-4">
            <v-avatar :image="blogPost.avatar_url" size="48" class="mx-auto" />
          </v-col>
          <v-col>
            <div>
              <v-card-title>
                {{ blogPost.title }}
              </v-card-title>
              <v-card-subtitle class="text-wrap pb-2">
                By {{ blogPost.full_name }}, {{ dayjs().to(dayjs(blogPost.created_at)) }}
              </v-card-subtitle>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-text v-linkify>
          {{ blogPost.content }}
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>