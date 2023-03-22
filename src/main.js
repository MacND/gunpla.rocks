import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import vuetify from "./plugins/vuetify";
import Vue3linkify from "vue-3-linkify";

const app = createApp(App)

app.use(router);
app.use(vuetify);
app.use(Vue3linkify);

router.isReady().then(() => {
  app.mount('#app');
})
