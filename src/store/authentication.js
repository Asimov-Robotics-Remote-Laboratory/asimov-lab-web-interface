// Utilities
import { defineStore } from 'pinia'
import authenticate from "@/services/authentication/authenticate";

const AUTHENTICATED = 'AUTHENTICATED';
const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED';

export const authenticationStore = defineStore('authenticationStore', {
  persist: {
    storage: sessionStorage
  },

  state: () => {
    return {
      _authenticatedUser: null,
      _authenticationStatus: NOT_AUTHENTICATED
    }
  },

  getters: {
    authenticatedUser: (state) => {
      return state._authenticatedUser;
    },
    authenticationStatus: (state) => {
      return state._authenticationStatus;
    }
  },

  actions: {
    updateUserData(user){
      this._authenticatedUser.data = user;
      this._authenticationStatus = AUTHENTICATED;
    },
    async authenticate(user) {
      try{
        this._authenticatedUser = await authenticate(user);
        this._authenticationStatus = AUTHENTICATED;
      }catch (resp) {
        this._authenticatedUser = null;
        this._authenticationStatus = NOT_AUTHENTICATED;
        throw resp;
      }
    },
    logout() {
      this._authenticatedUser = null;
      this._authenticationStatus = NOT_AUTHENTICATED;
    }
  }
});
