import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useTitleStore } from '~/stores/title'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,           // Timestamp when access token expires
    refreshExpiresAt: null,    // Timestamp when refresh token expires
    isAuthenticated: false,
    isInitialized: false,      // Flag to track if auth state loaded from storage
    isRefreshing: false,       // Flag to prevent multiple simultaneous refreshes
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
      
      // Prevent multiple simultaneous refresh calls
      if (this.isRefreshing) {
        // Wait for the ongoing refresh to complete
        await new Promise(resolve => {
          const checkRefreshing = setInterval(() => {
            if (!this.isRefreshing) {
              clearInterval(checkRefreshing);
              resolve();
            }
          }, 100);
        });
        return;
      }
      
      this.isRefreshing = true;
      
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
        
        this.isAuthenticated = true;
      } catch (error) {
        // If refresh fails, logout user
        this.logout();
        const router = useRouter();
        router.push('/login');
        throw new Error('Failed to refresh token.');
      } finally {
        this.isRefreshing = false;
      }
    },
    
    shouldRefreshToken() {
      // Refresh token if it expires in less than 5 minutes
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      return this.expiresAt && (this.expiresAt - Date.now()) < bufferTime;
    },
    
    isTokenExpired() {
      return this.expiresAt && Date.now() > this.expiresAt;
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
    async loadFromLocalStorage() {
      const token = localStorage.getItem('accessToken')
      const refresh = localStorage.getItem('refreshToken')
      const exp = localStorage.getItem('expiresAt')
      
      if (token && refresh && exp) {
        this.accessToken = token
        this.refreshToken = refresh
        this.expiresAt = Number(exp)
        
        // Check if token is expired or should be refreshed
        if (this.isTokenExpired()) {
          // Token expired, try to refresh
          try {
            await this.refreshAuthToken();
          } catch (error) {
            // Refresh failed, logout
            this.logout();
          }
        } else if (this.shouldRefreshToken()) {
          // Token expiring soon, refresh proactively
          try {
            await this.refreshAuthToken();
          } catch (error) {
            // Keep using current token if refresh fails
            console.warn('Token refresh failed, using current token');
          }
        } else {
          // Token is valid
          this.isAuthenticated = true;
        }
      }
      
      this.isInitialized = true;
    },
    updateActivity() {
      this.lastActivity = Date.now()
    },
    async checkTokenExpiry() {
      if (!this.isAuthenticated) {
        return false;
      }
      
      if (this.isTokenExpired()) {
        // Token expired, try to refresh
        try {
          await this.refreshAuthToken();
          return true;
        } catch (error) {
          // Refresh failed, logout and redirect
          this.logout();
          const router = useRouter();
          const title = useTitleStore();
          title.setTitle('Login');
          router.push('/login');
          return false;
        }
      } else if (this.shouldRefreshToken()) {
        // Token expiring soon, refresh proactively
        try {
          await this.refreshAuthToken();
        } catch (error) {
          console.warn('Token refresh failed, will retry on next check');
        }
      }
      
      return true;
    }
  }
})


