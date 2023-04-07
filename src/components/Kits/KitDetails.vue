<script setup>
import { supabase, getSession } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/massmech2@0.25x.png'
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
  await getKitByID(id);
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
    <div class="justify-left">
      <v-breadcrumbs :items="[{ title: 'Kit', href: '/kit' }, { title: kit.title, href: `/kit/${kit.title}` }]"></v-breadcrumbs>

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

          <v-carousel class="ma-2" hide-delimiters progress="indigo-accent-1" height="600px">
            <v-carousel-item :lazy-src=placeholderImg
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="indigo-accent-1" indeterminate></v-progress-circular>
                </div>
              </template></v-carousel-item>
            <v-carousel-item v-for="image in kit.images" :lazy-src=placeholderImg
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + image">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="indigo-accent-1" indeterminate></v-progress-circular>
                </div>
              </template></v-carousel-item>
          </v-carousel>

          <v-card class="ma-2 mt-auto" width="100%" color="grey-darken-3">
            <v-table :hover=true density="comfortable">
              <tbody>
                <tr>
                  <td>Grade Series</td>
                  <td></td>
                  <td>{{ kit.grade }} {{ kit?.line_name }}</td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td></td>
                  <td>{{ kit.scale }}</td>
                </tr>
                <tr v-if="kit.series_number">
                  <td>Series Number</td>
                  <td></td>
                  <td>#{{ kit.series_number }}</td>
                </tr>
                <tr>
                  <td>Model Number</td>
                  <td></td>
                  <td>{{ kit.model_number }}</td>
                </tr>
                <tr>
                  <td>Barcode</td>
                  <td></td>
                  <td>{{ kit.ean }}</td>
                </tr>
                <tr>
                  <td>Release Date</td>
                  <td></td>
                  <td>{{ kit.released_date }}</td>
                </tr>
              </tbody>
            </v-table>
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
  </div>
  </v-container>
</template>

