<script setup>
import { supabase, getSession, signOut } from '@/utils/supabase'
import { onMounted, ref, watch } from 'vue'

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
})

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
  }
}
</script>

<template>
  <v-app-bar color="indigo" density="compact">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="me-2"/>

      <router-link to="/">
        <v-img src="/favicon.ico" :width=36 />
      </router-link>



    <v-text-field
        hide-details
        hide-no-data
        prepend-inner-icon="mdi-magnify"
        single-line
        clearable 
        label="Search..."
        class="mx-4"
      ></v-text-field>

    <template v-slot:append>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon v-if="user" v-bind="props">
            <v-avatar :image="user.user_metadata.avatar_url" size="36"></v-avatar>
          </v-btn>
          <v-btn v-else prepend-icon="mdi-login" to="/login">Login</v-btn>
        </template>

        <v-card>
          <div class="mx-auto text-center">
            <v-btn prepend-icon="mdi-account" :rounded="0" to="/account">
              Account
            </v-btn>
            <v-divider />
            <v-btn prepend-icon="mdi-login" :rounded="0" @click="signOut()">
              Logout
            </v-btn>
          </div>
        </v-card>

      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" location="left" temporary>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Home" to="/" />
      <v-list-item prepend-icon="mdi-database" title="Kit DB" to="/kit" />
      <v-list-item prepend-icon="mdi-information" title="About" to="/about" />
    </v-list>
  </v-navigation-drawer>
</template>