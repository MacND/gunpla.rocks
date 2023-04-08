<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import { addKitToCollection, removeKitFromCollection } from '@/utils/supabase';
import placeholderImg from '@/assets/massmech2@0.25x.png'

const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const props = defineProps(['kit'])

async function copyUrl(modelNumber) {
  try {
    const absoluteUrl = new URL(`/kit/${modelNumber}`, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
  } catch (err) {
    console.error(err)
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

async function handleRemoveFromCollection(kitNumber) {
  try {
    await removeKitFromCollection(kitNumber)
    await collectionStore.getCollection();
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await authStore.getSession();
})
</script>

<script>
export default {
  data: () => ({
    snackbar: false,
    timeout: 2000
  })
}

</script>

<template>
  <v-card :key="props.kit.model_number" color="grey-darken-3" :id="props.kit.model_number" class="pa-1 ma-1" width="400px"
    :to="{ name: 'kit', params: { id: props.kit.model_number } }">
    <v-card class="mt-auto d-flex flex-column" width="100%" height="100%" color="grey-darken-4">
      <v-img
        :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + props.kit.model_number + '/box-art.webp'"
        :lazy-src=placeholderImg height="270px" class="mx-1 mt-1">
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="indigo-accent-1" indeterminate></v-progress-circular>
          </div>
        </template>
      </v-img>

      <div>
        <v-card-title class="text-wrap">
          {{ props.kit.grade_series }} {{ props.kit.title }}
        </v-card-title>

        <v-card-subtitle class="text-wrap">
          {{ props.kit.subtitle }}
        </v-card-subtitle>
      </div>

      <v-card-actions class="mt-auto" @click.prevent.stop>
        <template v-if="authStore.session && collectionStore.collection">
          <template v-if="(collectionStore.collection.filter(e => e.model_number === props.kit.model_number).length > 0)">
            <v-tooltip text="Remove from Collection" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-check-bold" variant="tonal" color="success" v-bind="props"
                  @click="handleRemoveFromCollection(kit.model_number)" @click.prevent.self />
              </template>
            </v-tooltip>
          </template>

          <template v-else>
            <v-tooltip text="Add to Collection" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-plus" variant="tonal" v-bind="props" @click="handleAddToCollection(kit.model_number)"
                  @click.prevent.self />
              </template>
            </v-tooltip>
          </template>
        </template>

        <v-tooltip text="Copy Link" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-clipboard-list-outline" v-bind="props" density="default" variant="tonal"
              @click="copyUrl(kit.model_number); snackbar = true" @click.prevent.self />
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-card>
  <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24" color="success">
    Link copied!
  </v-snackbar>
</template>