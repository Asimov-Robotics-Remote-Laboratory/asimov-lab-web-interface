// Utilities
import { defineStore } from 'pinia'

export const timezoneStore = defineStore('timezoneStore', {
  state: () => {
    return {
      _timezone : "America/Campo_Grande"
    }
  },
  getters: {
    timezone: (state) => {
      return state._timezone;
    }
  },
  actions: {
    setSuccessMessages(timezoneString){
      this._timezone = timezoneString;
    }
  }
});
