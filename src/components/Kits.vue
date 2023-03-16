<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'
import placeholderImg from '@/assets/placeholder.jpg'

const kits = ref([]);

async function getKits() {
  const { data, error } = await supabase
    .from('kit_view')
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
      <v-card v-for="kit in kits" :key="kit.model_number" color="grey-darken-3" :id="kit.model_number"
        class="pa-2 ma-2 d-flex flex-column" width="400px">
        <v-img
          :src="'https://hltytqzmvibmibifzerx.supabase.co/storage/v1/object/public/kit-images/' + kit.model_number + '/box-art.webp'"
          :lazy-src=placeholderImg height="270px">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="indigo-darken-3" indeterminate></v-progress-circular>
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
        <v-spacer></v-spacer>
        <v-card-actions class="mt-auto">
          <v-tooltip text="Add to Collection" location="top">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-plus" variant="tonal" color="indigo-accent-1" v-bind="props" />
            </template>
          </v-tooltip>

          <v-btn icon="mdi-clipboard-list-outline" color="indigo-accent-1" variant="tonal" />

          <v-tooltip text="Kit information" location="top">
            <template v-slot:activator="{ props }">
              <v-btn variant="tonal" color="indigo-accent-1" icon="mdi-information" v-bind="props" :to="{ name: 'kit', params: { id: kit.model_number } }" />
            </template>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </div>

    <v-responsive width="100%"></v-responsive>

  </v-container>
</template>

