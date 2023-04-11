import { defineStore } from 'pinia'
import { supabase, getUserProfile } from '@/utils/supabase'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentSession: null,
    currentUser: null
  }),
  getters: {
    session: (state) => state.currentSession,
    user: (state) => state.currentUser
  },
  actions: {
    async getSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
 
        if (data.session) {
          this.currentSession = data.session
          this.currentUser = data.session?.user
          this.currentUser.userProfile = await getUserProfile(data.session?.user?.id)
        }
    
      } catch (error) {
        console.error(error)
      }
    }
  }
})
