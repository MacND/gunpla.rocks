<script setup>
import { supabase, getSession, signOut } from '@/utils/supabase'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const searchQuery = ref('');
const searchResults = ref('');

onMounted(async () => {
  await authStore.getSession();
})

async function getKitsBySearchQuery(searchQuery) {
  try {
    const { data, error } = await supabase
      .from('kit_view')
      .select()
      .textSearch('title', searchQuery)

    if (data.length > 0) {
      kit.value = await data.pop();
      document.title = `${kit.value.grade_series} ${kit.value.title} - gunpla.rocks`
    }
    if (error) throw error
  } catch (error) {
    console.error(error.message)
  }
}

</script>


<!-- <input type="text" v-model="searchTxt">

data(){
    return{
        searchTxt: ''
    }
},

watch: {
    searchTxt: function(val) {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            alert('searching');
            alert(this.searchTxt); //alert value

            this.awaitingSearch = false;
          }, 2500); // 2.5 sec delay
        }
        this.awaitingSearch = true;
    }
} -->

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
        <v-img src="/android-chrome-192x192.png" :width=48 />
      </router-link>

    <!-- <v-text-field
        hide-details
        hide-no-data
        prepend-inner-icon="mdi-magnify"
        single-line
        clearable 
        placeholder="Search..."
        class="mx-4"
        v-model="searchQuery"
      ></v-text-field> -->

    <template v-slot:append>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon v-if="authStore.session" v-bind="props">
            <v-avatar :image="authStore.session.user.user_metadata.avatar_url" size="42"></v-avatar>
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
      <v-list-item prepend-icon="mdi-database" title="Kit DB" :to="{name: 'kit'}" />
      <v-list-item prepend-icon="mdi-post" title="Blog" to="/blog" />
      <v-list-item prepend-icon="mdi-information" title="About" to="/about" />
      <v-list-item prepend-icon="mdi-github" title="GitHub" target="_blank" href="https://github.com/macnd/gunpla.rocks" />
    </v-list>
  </v-navigation-drawer>
</template>