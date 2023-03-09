import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import KitView from '@/views/KitView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        titlePrefix: "Login"
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        titlePrefix: "About"
      }
    },
    {
      path: '/kit/:id?',
      name: 'kit',
      component: KitView,
      params: true,
      meta: {
        titlePrefix: "Kit"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
 // Get the page title from the route meta data that we have defined
  // See further down below for how we setup this data
  const title = to.meta.titlePrefix

  //Take the title from the parameters
  const titleFromParams = to.params.pageTitle;
  // If the route has a title, set it as the page title of the document/page
  if (title) {
    document.title = `${title} - gunpla.rocks`
  } else {
    document.title = "gunpla.rocks"
  }
  
  if (titleFromParams) {
    document.title = `${titleFromParams} - ${document.title}`;
  }
  // Continue resolving the route
  next()
})

export default router
