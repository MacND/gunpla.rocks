<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'

const kits = ref([]);

async function getKits() {
  const { data, error } = await supabase
    .from('kits')
    .select('*')

  if (error) throw error

  kits.value = data
}

onMounted(() => {
  getKits();
})
</script>

<script>
export default {
  data: () => ({
    show: false,
  })
}
</script>

<template>
  <v-container>
    <div class="d-flex flex-wrap align-content-center justify-center">
          <v-card v-for="kit in kits" :key="kit.model_number" color="indigo-darken-2" :id="kit.model_number " class="pa-2 ma-2" width="450" >
            <v-img :src="kit.cover_art" lazy-src="src/assets/placeholder.jpg" height="30vh">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="indigo-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>
            <v-card-title class="text-wrap">
              {{ kit.grade_series }} {{ kit.title }}
            </v-card-title>

            <v-card-subtitle class="text-wrap">
              {{ kit.subtitle }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn variant="tonal" prepend-icon="mdi-information" :to="{ name: 'kit', params: { id: kit.model_number } }">
                More Info
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

      <v-responsive width="100%"></v-responsive>

  </v-container>
</template>

