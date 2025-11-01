/**
 * API Interceptor Plugin
 * 
 * This plugin intercepts all $fetch calls to:
 * 1. Automatically inject authentication tokens
 * 2. Refresh tokens when they're about to expire
 * 3. Handle 401 errors and redirect to login
 * 4. Prevent multiple simultaneous token refreshes
 */

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()
  const router = useRouter()

  // Store the original $fetch
  const originalFetch = globalThis.$fetch

  // Create a custom fetch wrapper
  const customFetch = async (request, options = {}) => {
    // Skip auth for login/refresh endpoints
    const url = typeof request === 'string' ? request : request.url
    if (url.includes('/api/login') || url.includes('/api/refresh')) {
      return originalFetch(request, options)
    }

    // Ensure auth is initialized
    if (!auth.isInitialized) {
      await auth.loadFromLocalStorage()
    }

    // Check if user is authenticated
    if (auth.isAuthenticated) {
      // Check if token needs refresh
      if (auth.shouldRefreshToken() && !auth.isRefreshing) {
        try {
          await auth.refreshAuthToken()
        } catch (error) {
          console.warn('Proactive token refresh failed:', error)
        }
      }

      // Check if token is expired
      if (auth.isTokenExpired()) {
        try {
          await auth.refreshAuthToken()
        } catch (error) {
          auth.logout()
          router.push('/login')
          throw new Error('Token expired and refresh failed')
        }
      }

      // Inject authorization header
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${auth.accessToken}`
      }
    }

    try {
      // Make the actual API call
      const response = await originalFetch(request, options)
      
      // Update last activity on successful API call
      if (auth.isAuthenticated) {
        auth.updateActivity()
      }
      
      return response
    } catch (error) {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 || error.statusCode === 401) {
        console.log('Received 401, attempting token refresh...')
        
        try {
          // Try to refresh the token
          await auth.refreshAuthToken()
          
          // Retry the request with new token
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${auth.accessToken}`
          }
          
          return await originalFetch(request, options)
        } catch (refreshError) {
          // Refresh failed, logout and redirect to login
          console.error('Token refresh failed after 401:', refreshError)
          auth.logout()
          router.push('/login')
          throw new Error('Authentication failed')
        }
      }

      // For other errors, just throw them
      throw error
    }
  }

  // Override global $fetch with our custom wrapper
  globalThis.$fetch = customFetch
  
  // Also provide it through nuxtApp for consistency
  nuxtApp.provide('fetch', customFetch)
})
