<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/massmech2@1x.png'
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import { addKitToCollection } from '@/utils/supabase';

const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const kits = ref([]);

async function getKits() {
  try {
    const { data, error } = await supabase
      .from('kit_view')
      .select('*')
      .order('id')

    if (error) throw error
    kits.value = data
  } catch (error) {
    console.error(error)
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
  await getKits();
  await authStore.getSession();
  await collectionStore.getCollection();
})
</script>

<script>
export default {
  data: () => ({
    show: false,
    snackbar: false,
    timeout: 2000
  })
}

async function copyUrl(modelNumber) {
  try {
    const absoluteUrl = new URL(`/kits/${modelNumber}`, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <v-responsive width="100%">
    <v-container>
      <div class="d-flex flex-wrap justify-center">
        <v-card v-for="kit in kits" :key="kit.model_number" color="grey-darken-3" :id="kit.model_number" class="pa-1 ma-1"
          width="400px">
          <v-card class="mt-auto d-flex flex-column" width="100%" height="100%" color="grey-darken-4">
            <v-img
              :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'"
              :lazy-src=placeholderImg height="270px" class="mx-1 mt-1">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="indigo-accent-1" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>

            <div>
              <v-card-title class="text-wrap">
                {{ kit.grade_series }} {{ kit.title }}
              </v-card-title>

              <v-card-subtitle class="text-wrap">
                {{ kit.subtitle }}
              </v-card-subtitle>
            </div>

            <v-card-actions class="mt-auto">
              <template v-if="authStore.session && collectionStore.collection">
                <template
                  v-if="(collectionStore.collection.filter(e => e.model_number === kit.model_number).length > 0)">
                  <v-btn icon="mdi-check-bold" variant="tonal" color="success"/>

                </template>

                <template v-else>
                  <v-tooltip text="Add to Collection" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-plus" variant="tonal" v-bind="props" @click="handleAddToCollection(kit.model_number)" />
                    </template>
                  </v-tooltip>
                </template>
              </template>

              <v-btn icon="mdi-clipboard-list-outline" density="default" variant="tonal" @click="copyUrl(kit.model_number); snackbar = true" />

              <v-tooltip text="Kit information" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-information" density="default" variant="tonal" v-bind="props"
                    :to="{ name: 'kit', params: { id: kit.model_number } }" />
                </template>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-card>
      </div>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24" color="success">
          Link copied!
        </v-snackbar>
  </v-responsive>
</template>

