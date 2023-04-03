import { defineStore } from 'pinia'
import { getSelfCollection } from '@/utils/supabase'

export const useCollectionStore = defineStore("collection", {
  state: () => ({
    currentCollection: null
  }),
  getters: {
    collection: (state) => state.currentCollection
  },
  actions: {
    async getCollection() {
      const userCollection = await getSelfCollection();
      this.currentCollection = userCollection
    }
  }
})