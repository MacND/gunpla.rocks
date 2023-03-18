<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const announcements = ref([]);

async function getSiteAnnouncements() {
  const { data, error } = await supabase
    .from('site_announcements')
    .select('*')
    .limit(3)

  if (error) throw error

  announcements.value = data
}

onMounted(() => {
  getSiteAnnouncements();
})
</script>

<template>
  <v-container>
    <v-card>
      <v-list lines="one" density="compact" >
        <v-list-subheader class="text-overline">Site Announcements</v-list-subheader>
      </v-list>
      <v-divider></v-divider>
      <v-list lines="two">
        <v-list-item v-for="item in announcements"
          :key="item.id" 
          :title="item.title + ' - by ' + item.full_name + ', ' + dayjs().to(dayjs(item.created_at))"
          :subtitle="item.body"
          :prepend-avatar="item.avatar_url" >
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>