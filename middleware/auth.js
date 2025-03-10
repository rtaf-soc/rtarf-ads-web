export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const auth = useAuthStore()
    if (!auth.isInitialized) {
      await auth.loadFromLocalStorage()
    }
    if (!auth.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})
