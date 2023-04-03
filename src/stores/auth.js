import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

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
      const { data, error } = await supabase.auth.getSession()
      this.currentSession = data.session
      this.currentUser = data.session?.user
    }
  }
})
