// stores/auth.js

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    login(username, password) {
      // Simulate an API call for login
      return new Promise((resolve, reject) => {
        if (username === 'admin' && password === 'admin') {
          this.isAuthenticated = true;
          resolve(true);
        } else {
          this.isAuthenticated = false;
          reject(new Error('Invalid credentials'));
        }
      });
    },
    logout() {
      this.isAuthenticated = false;
    },
  },
});
