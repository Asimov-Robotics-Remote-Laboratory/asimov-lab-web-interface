// Utilities
import { defineStore } from 'pinia'

const HIDE = 'HIDE';
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';
const WARNING = 'WARNING';

export const notificationStore = defineStore('notificationStore', {
  state: () => {
    return {
      _notificationMessages:[],
      _notificationStatus :HIDE
    }
  },
  getters: {
    notificationMessages: (state) => {
      return state._notificationMessages
    },
    notificationStatus: (state) => {
      return state._notificationStatus
    }
  },
  actions: {
    setSuccessMessages(messages){
      this._notificationMessages = messages;
      this._notificationStatus = SUCCESS;
    },
    setErrorMessages(messages){
      this._notificationMessages = messages;
      this._notificationStatus = ERROR;
    },
    setWarningMessages(messages){
      this._notificationMessages = messages;
      this._notificationStatus = WARNING;
    },
    clearNotification(){
      this._notificationMessages = [];
      this._notificationStatus = HIDE;
    }
  }
});
