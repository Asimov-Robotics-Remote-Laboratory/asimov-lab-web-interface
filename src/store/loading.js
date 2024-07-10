// Utilities
import { defineStore } from 'pinia'

export const loadingStore = defineStore('loadingStore', {
  state: () => {
    return {
      _loadingStatus: false
    }
  },
  getters: {
    loadingStatus: (state) => {
      return state._loadingStatus
    }
  },
  actions: {
    loadingStart(){
      this._loadingStatus = true;
    },
    loadingEnd(){
      this._loadingStatus = false;
    }
  }
});
