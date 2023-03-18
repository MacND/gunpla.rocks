<script setup>
import { supabase } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/placeholder.jpg'

const route = useRoute();
const id = route.params.id;
const kit = ref();
const images = ref();
const url = new URL(route.path, window.location.origin).href

async function getImages(modelNumber) {
  const { data, error } = await supabase
  .storage
  .from('kit-images')
  .list(modelNumber, {
    limit: 20,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })
  
  
  if (data) {
    images.value = data.filter((obj) => {
      return obj.name !== 'box-art.webp'
    })
  }
}

async function getKitByID(kitID) {
  const { data, error } = await supabase
    .from('kit_view')
    .select('*')
    .eq('model_number', kitID)
    .limit(1);
  
  if (data.length > 0) {
    kit.value = await data.pop();
    document.title = `${kit.value.grade_series} ${kit.value.title} - gunpla.rocks`
  } 
}

onMounted(() => {
  if (id) {
    getKitByID(id);
    getImages(id);
  }
});
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
  <v-container v-if="kit" class="d-flex flex-wrap justify-center">
    <Teleport to="head">
      <meta property="og:url" :content="url">
      <meta property="og:title" :content="kit.title + ' - gunpla.rocks'">
      <meta property="og:description" :content="kit.grade_series + ' ' + kit.title">
      <meta property="og:image" :content="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'">
      <meta name="twitter:card" content="summary_large_image">
    </Teleport>
    <v-card class="pa-2 ma-2 justify-center" color="grey-darken-3">
      <title>{{ kit.title + 'gunpla.rocks' }}</title>
      <div class="d-flex flex-wrap justify-start">
        <div>
          <v-card-title class="text-wrap">
            {{ kit.grade_series }} {{ kit.title }}
          </v-card-title>

          <v-card-subtitle class="text-wrap pb-2">
            {{ kit.subtitle }}
            <v-divider></v-divider>
          </v-card-subtitle>
        </div>
        <v-carousel class="pa-2" hide-delimiters>
          <v-carousel-item :lazy-src=placeholderImg 
            :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'" />
          <v-carousel-item v-for="image in images" :lazy-src=placeholderImg
            :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/' + image.name" />
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
        <v-btn prepend-icon="mdi-arrow-left" variant="tonal" @click="$router.go(-1)">
          Back
        </v-btn>
        <v-btn prepend-icon="mdi-content-copy" variant="tonal" :to="{ name: 'kit', params: { id: kit.model_number } }"
          @click="copyUrl(route.path); snackbar = true">
          Copy Link
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24" color="success">
        Link copied!
      </v-snackbar>
    </v-card>
  </v-container>
</template>

