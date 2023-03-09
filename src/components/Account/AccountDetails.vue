<script setup>
import { supabase, getSession } from '@/utils/supabase'
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

const session = ref({});
const user = ref();

onMounted(async () => {
  const retrievedSession = await getSession();
  session.value = retrievedSession;
  
  if (session.value) {
    // console.log('Session has value, processing user data')
    user.value = JSON.parse(JSON.stringify(session.value.user))
  }

  supabase.auth.onAuthStateChange((_, _session) => {
    // console.log('Auth state changed!')
    session.value = _session
  })
});

watch(() => session.value, (newUser) => {
  if (newUser) {
    user.value = newUser.user
  } else {
    user.value = ""
  }
});
</script>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null
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
    <v-card v-if="user" elevation="6" max-width="500" rounded class="pa-4 mx-auto text-center">
      <v-avatar :image="user.user_metadata.avatar_url" size="128" class="ma-2"></v-avatar>
      <h2 class="text-h5">{{ user.user_metadata.full_name }}</h2>
      <h4 class="text-subtitle-1">{{ user.email }}</h4>
      <v-divider class="ma-2 mb-2" />
      <v-list disabled density="compact" class="text-start">
        <template v-for="identity in user.identities">
          <v-list-subheader>{{ identity.provider[0].toUpperCase() + identity.provider.substring(1) }}</v-list-subheader>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-email"/>
            </template>
            <v-list-item-title>Email Address</v-list-item-title>
            <v-list-item-subtitle>{{ identity.identity_data.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-account"/>
            </template>
            <v-list-item-title>{{ identity.provider[0].toUpperCase() + identity.provider.substring(1) + ' Name' }}</v-list-item-title>
            <v-list-item-subtitle>{{ identity.identity_data.name }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-clock-check"/>
            </template>
            <v-list-item-title>Last signed in</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(identity.last_sign_in_at) }}</v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
      <!-- <v-btn class="text-none" width="90">Logout</v-btn> -->
    </v-card>
    <router-link to="/login"></router-link>
  </v-container>
</template>
