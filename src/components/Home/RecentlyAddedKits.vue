<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'

const kits = ref([]);

async function getRecentlyAddedKits() {
  const { data, error } = await supabase
    .from('recently_added_kits')
    .select('*')

  if (error) throw error

  kits.value = data
}

onMounted(() => {
  getRecentlyAddedKits();
})
</script>

<template>
  <v-container>
    <v-card>
      <v-list lines="one" density="compact" >
        <v-list-subheader class="text-overline">Recently Added Kits</v-list-subheader>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="kit in kits"
          :key="kit?.model_number" 
          :title="kit?.grade_series + ' ' + kit?.title"
          :subtitle="kit?.subtitle"
          :prepend-avatar="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit?.model_number + '/box-art.webp'"
          :to="{ name: 'kit', params: { id: kit?.model_number } }">
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>