import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,           // Timestamp when access token expires
    refreshExpiresAt: null,    // Timestamp when refresh token expires
    isAuthenticated: false,
    lastActivity: Date.now()   // Last recorded user activity time
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await $fetch('/api/login', {
          method: 'POST',
          body: { username, password }
        })
        // Save tokens and calculate expiration timestamps
        this.accessToken = response.access_token
        this.refreshToken = response.refresh_token
        this.expiresAt = Date.now() + response.expires_in * 1000
        this.refreshExpiresAt = Date.now() + response.refresh_expires_in * 1000
        this.isAuthenticated = true
        this.lastActivity = Date.now()

        // Persist token details in local storage
        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('expiresAt', this.expiresAt.toString())
        return true
      } catch (error) {
        this.isAuthenticated = false
        throw new Error('Invalid credentials')
      }
    },
    async refreshAuthToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available.');
      }
      
      try {
        const response = await $fetch('/api/refresh', {
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        });
        
        // Update token details from response
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresAt = Date.now() + response.expires_in * 1000;
        this.refreshExpiresAt = Date.now() + response.refresh_expires_in * 1000;
        
        // Update localStorage accordingly
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('expiresAt', this.expiresAt.toString());
      } catch (error) {
        throw new Error('Failed to refresh token.');
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.expiresAt = null
      this.refreshExpiresAt = null
      this.isAuthenticated = false

      // Remove stored token details
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expiresAt')
    },
    loadFromLocalStorage() {
      const token = localStorage.getItem('accessToken')
      const refresh = localStorage.getItem('refreshToken')
      const exp = localStorage.getItem('expiresAt')
      if (token && refresh && exp && Date.now() < Number(exp)) {
        this.accessToken = token
        this.refreshToken = refresh
        this.expiresAt = Number(exp)
        this.isAuthenticated = true
      }
    },
    updateActivity() {
      this.lastActivity = Date.now()
    },
    checkTokenExpiry() {
      if (this.expiresAt && Date.now() > this.expiresAt) {
        this.logout()
        const router = useRouter()
        router.push('/login')
      }
    }
  }
})


