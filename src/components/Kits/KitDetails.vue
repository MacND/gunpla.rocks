<script setup>
import { supabase, getSession } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/placeholder.jpg'

const route = useRoute();
const id = route.params.id;
const kit = ref();
const images = ref();
const url = new URL(route.path, window.location.origin).href
const session = ref();
// const collection = ref([]);

session.value = async () => {
  await getSession();
}

// async function retrieveUserSession() {
//   session.value = await getSession();
// }

async function getImages(modelNumber) {
  try {
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

    if (error) throw error
  } catch (error) {
    console.log(error.message)
  }
}

async function getKitByID(kitID) {
  try {
    const { data, error } = await supabase
      .from('kit_view')
      .select('*')
      .eq('model_number', kitID)
      .limit(1);

    if (data.length > 0) {
      kit.value = await data.pop();
      document.title = `${kit.value.grade_series} ${kit.value.title} - gunpla.rocks`
    }
    if (error) throw error
  } catch (error) {
    console.log(error.message)
  }
}

// async function getCollectionForUser() {
//   const { data, error } = await supabase
//   .from('collections')
//   .select('*');

//   if (data?.length > 0) {
//     collection.value = data
//   }
// }

// async function addKitToCollection(kitID) {
//   try {
//     const { data, error } = await supabase
//       .from('collections')
//       .insert(
//         { 'kit_model_number': kitID }
//       );
//   } catch (error) {
//     console.error(error.message)
//     return false
//   }

//   if (data?.length > 0) {
//     return true
//   } 
// }

onMounted(() => {
  if (id) {
    getKitByID(id);
    getImages(id);
    // retrieveUserSession();
    // getCollectionForUser();
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
      <meta property="og:image"
        :content="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'">
      <meta name="twitter:card" content="summary_large_image">
    </Teleport>
    <v-card class="justify-center" color="indigo-darken-1" variant="outlined">
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
            <v-carousel-item v-for="image in images" :lazy-src=placeholderImg
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/' + image.name" />
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
          <!-- <v-tooltip v-if="session" text="Add to Collection" location="top">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-plus" variant="tonal" v-bind="props" @click="addKitToCollection(kit.model_number)" />
            </template>
          </v-tooltip> -->
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
