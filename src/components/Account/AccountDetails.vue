<script setup>
import { getSelfProfile } from '@/utils/supabase'

import { onMounted, ref } from 'vue'
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const userProfile = ref();

onMounted(async () => {
  await authStore.getSession();
  await collectionStore.getCollection();
  userProfile.value = await getSelfProfile();

});
</script>

<script>
export default {
  data: () => ({
    tab: null,
    tabs: ['account', 'posts']

  }),
  watch: {
    group() {
      this.drawer = false
    },
  },
  methods: {
    formatDate(datetime) {
      const date = dayjs(datetime);
      return date.format('LLL')
    }
  }
}
</script>

<template>
  <v-container>
    <v-card v-if="authStore.user" elevation="6" max-width="500" rounded class="pa-4 mx-auto text-center">
      <v-avatar :image="authStore.user.user_metadata.avatar_url" size="128" class="ma-2" ></v-avatar>

      <h2 class="text-h5">Account Details</h2>
      <v-divider class="ma-2 mb-2" />

      <v-tabs v-model="tab">
        <v-tab v-for="item in tabs" :key="item" :value="item">{{ item }}</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="account">
          <v-list density="compact" class="text-start">
            <template v-if="userProfile">
              <v-list-subheader>Profile (Public)</v-list-subheader>
              <v-list-item disabled>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account" />
                </template>
                <v-list-item-title>Name</v-list-item-title>
                <v-list-item-subtitle>{{ userProfile.full_name }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item :to="{ name: 'collection', params: { username: userProfile.username } }">
                <template v-slot:prepend>
                  <v-icon icon="mdi-rename-box" />
                </template>
              <v-list-item-title >Profile Name</v-list-item-title>
              <v-list-item-subtitle >{{ userProfile.username }}</v-list-item-subtitle>

            </v-list-item>
          </template>
        </v-list>

          <v-divider></v-divider>

          <v-list disabled density="compact" class="text-start">
            <template v-for="identity in authStore.user.identities">
              <v-list-subheader>{{ identity.provider[0].toUpperCase() + identity.provider.substring(1)
              }} (Private)</v-list-subheader>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account" />
                </template>
                <v-list-item-title>Username</v-list-item-title>
                <v-list-item-subtitle>{{ identity.identity_data.name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-email" />
                </template>
                <v-list-item-title>Email Address</v-list-item-title>
                <v-list-item-subtitle>{{ identity.identity_data.email }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-identifier" />
                </template>
                <v-list-item-title>User ID</v-list-item-title>
                <v-list-item-subtitle>{{ identity.identity_data.sub }}</v-list-item-subtitle>
              </v-list-item>



            </template>
          </v-list>
        </v-window-item>

        <v-window-item value="posts">
          <v-list density="compact" class="text-start">
            <v-list-item>
              <v-list-item-title>Coming Soon</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>
