<script setup>
import { getUserID, getUserProfile, getCollectionForUser } from '@/utils/supabase'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import KitListCard from '@/components/Kits/KitListCard.vue'

const route = useRoute();
const username = route.params.username;
const userDetails = ref();
const collection = ref();

const authStore = useAuthStore();
const collectionStore = useCollectionStore();

async function getCollection(userID) {
  try {
    collection.value = await getCollectionForUser(userID);
  } catch {
    console.error('Error retrieving user collection')
  }
}

async function copyUrl(link) {
  try {
    const absoluteUrl = new URL(link, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  if (username) {
    let userID = await getUserID(username);
    userDetails.value = await getUserProfile(userID);
    collection.value = await getCollectionForUser(userID);
  }
  await collectionStore.getCollection();
});
</script>

<script>
export default {
  data: () => ({
    snackbar: false,
    timeout: 1000
  })
}
</script>

<template>
  <v-responsive width="100%">
    <v-container class="d-flex flex-wrap justify-center">
      <v-card class="px-8 mb-2 text-center">
        <template v-if="userDetails || authStore.user">
          <template v-if="userDetails">
            <v-avatar :image="userDetails.avatar_url" size="48" class="mt-2" />
            <div class="text-h4 pa-2 text-center">{{ userDetails.full_name }}'s Collection</div>
            <v-btn prepend-icon="mdi-content-copy" variant="tonal" class="mb-2"
              @click="copyUrl(route.path); snackbar = true">
              Copy Link
            </v-btn>
          </template>
          
          <template v-else-if="authStore.user">
            <v-avatar :image="authStore.user.user_metadata.avatar_url" size="48"  class="mt-2" />
            <div class="text-h4 pa-2 text-center">My Collection</div>
            <v-btn prepend-icon="mdi-content-copy" variant="tonal" class="mb-2"
              @click="copyUrl(route.path + '/' + authStore.user.userProfile.username); snackbar = true">
              Copy Link
            </v-btn>
          </template>
          
        </template>

        <template v-else>
          <v-card-title>No user specified, and no user logged in.</v-card-title>
        </template>
      </v-card>

      <div class="d-flex flex-wrap justify-center">
        <template v-if="collection" v-for="kit in collection">
          <KitListCard :kit="kit"></KitListCard>
        </template>
        <template v-else-if="collectionStore.collection" v-for="kit in collectionStore.collection">
          <KitListCard :kit="kit"></KitListCard>
        </template>
      </div>
      <v-snackbar v-model="snackbar" :timeout="timeout" elevation="24" color="success">
    Link copied!
  </v-snackbar>
    </v-container>
  </v-responsive>
</template>