import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import AccountView from '@/views/AccountView.vue'
import KitDetailsView from '@/views/KitDetailsView.vue'
import KitDBView from '@/views/KitDBView.vue'
import BlogView from '@/views/BlogView.vue'
import CollectionView from '@/views/CollectionView.vue'
import ErrorView from '@/views/ErrorView.vue'
import { useAuthStore } from '@/stores/auth';


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
      path: '/db',
      name: 'db',
      component: KitDBView,
      meta: {
        titlePrefix: "Kit DB"
      }
    },
    {
      path: '/kit/:id',
      name: 'kit',
      component: KitDetailsView,
      params: true,
      meta: {
        titlePrefix: "Kit"
      }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {

        titlePrefix: 'Account',
        requiresAuth: true
      }

    },
    {
      path: '/blog/:id?',
      name: 'blog',
      component: BlogView,
      params: true,
      meta: {
        titlePrefix: "Blog"
      }

    },
    {
      path: '/collection/:username?',
      name: 'collection',
      component: CollectionView,
      params: true,
      meta: {
        titlePrefix: "Collection"
      }
    },
    { 
      path: "/:catchAll(.*)", 
      component: ErrorView,
      meta: {
        titlePrefix: "Error"
      }

    }
  ]
});

router.beforeEach((to) => {
  // Check if route requires auth
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.session) return '/login'
})

router.beforeEach((to) => {
  // If user is logged in, check if they've set their username
  // If they haven't, force them to the Account page to set it
  const authStore = useAuthStore();

  if (authStore.session) {
    // If there's a session, check for the user's username
    const user = authStore.user

    if (user.userProfile.username == "") {
      return '/account'
    }

  }
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
