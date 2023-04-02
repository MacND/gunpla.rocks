import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import vuetify from "./plugins/vuetify";
import Vue3linkify from "vue-3-linkify";
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router);
app.use(vuetify);
app.use(Vue3linkify);
app.use(pinia);

router.isReady().then(() => {
  app.mount('#app');
})
