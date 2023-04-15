<script setup>
import { supabase } from '@/utils/supabase'
import { onMounted, ref } from 'vue'
import { useCollectionStore } from '@/stores/collection';

import KitListCard from '@/components/Kits/KitListCard.vue'

const kits = ref([]);
const collectionStore = useCollectionStore();

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

onMounted(async () => {
  await getKits();
  await collectionStore.getCollection();
})
</script>

<template>
  <v-responsive width="100%">
    <v-container>
      <div class="d-flex flex-wrap justify-center">
        <v-card>
          <v-card-title>Notice a kit is missing?  Submit using this form:</v-card-title>
          <v-card-text>
            <a href="https://forms.gle/vFeYGRYT7CbWFeWi7" target="_blank">https://forms.gle/vFeYGRYT7CbWFeWi7</a></v-card-text>
        </v-card>
        </div><div class="d-flex flex-wrap justify-center">
        <template v-for="kit in kits">
          <Suspense>
            <KitListCard :kit="kit" ></KitListCard>
          </Suspense>
        </template>
      </div>
    </v-container>
  </v-responsive>
</template>

