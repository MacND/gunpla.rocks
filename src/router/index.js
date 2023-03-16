import { createRouter, createWebHistory } from 'vue-router'
import { getSession, supabase } from '@/utils/supabase'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import KitView from '@/views/KitView.vue'
import AccountView from '@/views/AccountView.vue'
import ErrorView from '@/views/ErrorView.vue'
// import { props } from 'v-lazy-image'
// import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'

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
      },
      beforeEnter: async (to, from) => {
        if (to.params.id) {
          const { data, error } = await supabase
            .from('kit_view')
            .select('*')
            .eq('model_number', to.params.id)
            .limit(1)

          if (data.length > 0) {
            to.params.kitDetails = await data.pop()
            console.log(to.params.kitDetails)
            document.title = `${to.params.kitDetails.grade_series} ${to.params.kitDetails.title} - gunpla.rocks`
          } 
        } 
      }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {
        titlePrefix: 'Account'
      },
      beforeEnter: async (to, from) => {
        const retrievedSession = await getSession();
        if (!retrievedSession) {
          return { name: 'login' }
        }
      },
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
