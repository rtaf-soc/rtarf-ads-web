/**
 * useAuthFetch - A composable for authenticated API calls
 * 
 * This wrapper around $fetch automatically:
 * - Injects the authentication token in headers
 * - Refreshes token if it's about to expire
 * - Handles 401 errors by redirecting to login
 * - Prevents multiple simultaneous API calls during token refresh
 * 
 * Usage:
 *   const authFetch = useAuthFetch()
 *   const data = await authFetch('/api/endpoint', { method: 'GET' })
 */

export const useAuthFetch = () => {
  const auth = useAuthStore()
  const router = useRouter()

  return async (url, options = {}) => {
    // Ensure auth is initialized
    if (!auth.isInitialized) {
      await auth.loadFromLocalStorage()
    }

    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      router.push('/login')
      throw new Error('Not authenticated')
    }

    // Check if token needs refresh before making API call
    if (auth.shouldRefreshToken()) {
      try {
        await auth.refreshAuthToken()
      } catch (error) {
        // Refresh failed, redirect to login
        router.push('/login')
        throw new Error('Token refresh failed')
      }
    }

    // Check if token is expired
    if (auth.isTokenExpired()) {
      try {
        await auth.refreshAuthToken()
      } catch (error) {
        // Token expired and refresh failed
        auth.logout()
        router.push('/login')
        throw new Error('Token expired')
      }
    }

    // Merge authorization header with existing headers
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${auth.accessToken}`
    }

    try {
      // Make the actual API call with auth header
      const response = await $fetch(url, {
        ...options,
        headers
      })

      // Update last activity timestamp
      auth.updateActivity()

      return response
    } catch (error) {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 || error.statusCode === 401) {
        // Token is invalid, try to refresh
        try {
          await auth.refreshAuthToken()
          
          // Retry the request with new token
          const retryHeaders = {
            ...options.headers,
            Authorization: `Bearer ${auth.accessToken}`
          }
          
          return await $fetch(url, {
            ...options,
            headers: retryHeaders
          })
        } catch (refreshError) {
          // Refresh failed, logout and redirect
          auth.logout()
          router.push('/login')
          throw new Error('Authentication failed')
        }
      }

      // For other errors, just throw them
      throw error
    }
  }
}
