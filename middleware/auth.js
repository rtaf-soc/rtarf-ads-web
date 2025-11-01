export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const auth = useAuthStore()
    
    // Initialize auth state from localStorage if not already done
    if (!auth.isInitialized) {
      await auth.loadFromLocalStorage()
    }
    
    // Skip auth check for login page
    if (to.path === '/login') {
      return
    }
    
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // Check token expiry and refresh if needed
    const isValid = await auth.checkTokenExpiry()
    if (!isValid) {
      // Token expired and refresh failed, redirect to login
      return navigateTo('/login')
    }
  }
})
