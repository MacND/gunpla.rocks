<script setup>
import { supabase } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const kits = ref({});
const route = useRoute();
const id = route.params.id;

onMounted(() => {
  getKitByID(id);
})

async function getKitByID(id) {
  const { data, error } = await supabase
    .from('kits')
    .select('*')
    .eq('ean', id)
    .limit(1)
  if (error) throw error

  kits.value = data
}
</script>

<script>
export default {
  data: () => ({
    show: false,
    snackbar: false,
    timeout: 2000
  })
}

async function copyUrl(link) {
  try {
    const absoluteUrl = new URL(link, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card color="blue-grey-darken-2" v-for="kit in kits" :key="kit.ean" class="pa-2 ma-2">
          <div class="d-flex flex-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">
                {{ kit.grade_series }} {{ kit.title }}
              </v-card-title>

              <v-card-subtitle>
                {{ kit.subtitle }}
                <v-divider></v-divider>
              </v-card-subtitle>
            </div>
              <v-carousel class="pa-2 fill-height" hide-delimiters >
                <v-carousel-item :src="kit.cover_art" />
                <v-carousel-item v-for="image in kit.images" :src="image"/>
              </v-carousel>

            <div>
              <v-card-text>
                <div> {{ kit.grade }} {{ kit.scale }} Scale</div>
                <div> {{ kit.grade_series }} #{{ kit.series_number }} </div>
                <div> Released: {{ kit.released_date }} </div>
                <div> Bandai Model Number: {{ kit.model_number }} </div>
                <div> EAN: {{ kit.ean }} </div>
              </v-card-text>
            </div>


          </div>
          <v-card-actions>
            <v-btn prepend-icon="mdi-arrow-left" :to="{ name: 'kit' }">
              Back
            </v-btn>
            <v-btn prepend-icon="mdi-content-copy" :to="{ name: 'kit', params: { id: kit.ean } }" @click="copyUrl(route.path); snackbar = true">
              Copy Link
            </v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24"  color="success">
            Link copied!
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

