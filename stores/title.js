// stores/weight.js
import { defineStore } from 'pinia';

export const useTitleStore = defineStore('title', {
  state: () => ({
    title: 'Waiting for data...'
  }),
  actions: {
    setTitle(newTitle) {
      this.title = newTitle;
    }
  }
});
