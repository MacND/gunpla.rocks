<script setup>
import { supabase, getSession } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/massmech2@4x.png'
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import { addKitToCollection } from '@/utils/supabase';

const route = useRoute();
const id = route.params.id;
const authStore = useAuthStore();
const collectionStore = useCollectionStore();

const kit = ref();

async function getKitByID(kitID) {
  try {
    const { data, error } = await supabase
      .from('kit_view')
      .select('*')
      .eq('model_number', kitID)
      .limit(1);

    if (error) throw error

    if (data.length > 0) {
      kit.value = await data.pop();
      document.title = `${kit.value.grade_series} ${kit.value.title} - gunpla.rocks`
    }

  } catch (error) {
    console.error(error.message)
  }
}

async function handleAddToCollection(kitNumber) {
  try {
    await addKitToCollection(kitNumber)
    await collectionStore.getCollection();
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  // if (id) {
  await getKitByID(id);
  // }
  await authStore.getSession();
  await collectionStore.getCollection();
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
    <v-card class="justify-center pa-1" color="grey-darken-3">
      <v-card color="grey-darken-4">
        <div class="d-flex flex-wrap justify-start">
          <div>
            <v-card-title class="text-wrap">
              {{ kit.grade_series }} {{ kit.title }}
            </v-card-title>

            <v-card-subtitle class="text-wrap">
              {{ kit.subtitle }}
              <v-divider></v-divider>
            </v-card-subtitle>
          </div>
          <v-carousel class="ma-2" hide-delimiters>
            <v-carousel-item :lazy-src=placeholderImg
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'" />
            <v-carousel-item v-for="image in kit.images" :lazy-src=placeholderImg
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + image" />
          </v-carousel>

          <v-card class="ma-2 d-flex mt-auto" width="100%" color="grey-darken-3">
            <v-card-text>
              <p> {{ kit.grade }} {{ kit.scale }} Scale</p>
              <p v-if="kit.series_number"> {{ kit.grade_series }} #{{ kit.series_number }} </p>
              <p> Released: {{ kit.released_date }} </p>
              <p> Bandai Model Number: {{ kit.model_number }} </p>
              <p> EAN: {{ kit.ean }} </p>
            </v-card-text>
          </v-card>

        </div>
        <v-card-actions class="mb-2">
          <template v-if="authStore.session && collectionStore.collection">
            <template v-if="(collectionStore.collection.filter(e => e.model_number === kit.model_number).length > 0)">
              <v-btn prepend-icon="mdi-check-bold" variant="tonal" color="success">In Collection</v-btn>
            </template>
            
            <template v-else>
              <v-btn prepend-icon="mdi-plus" variant="tonal" @click="handleAddToCollection(kit.model_number)">Add to
                Collection</v-btn>
            </template>
          </template>
          <v-btn prepend-icon="mdi-content-copy" variant="tonal" :to="{ name: 'kit', params: { id: kit.model_number } }"
            @click="copyUrl(route.path); snackbar = true">
            Copy Link
          </v-btn>
        </v-card-actions>
        <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24" color="success">
          Link copied!
        </v-snackbar>
      </v-card>
    </v-card>
  </v-container>
</template>

