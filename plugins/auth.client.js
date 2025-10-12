export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  
  // Load auth state from localStorage on app initialization
  await auth.loadFromLocalStorage();
  
  // Set up periodic token check (every 60 seconds)
  if (import.meta.client) {
    setInterval(async () => {
      if (auth.isAuthenticated) {
        // Check if token expired or needs refresh
        if (auth.isTokenExpired()) {
          try {
            await auth.refreshAuthToken();
          } catch (error) {
            console.error('Periodic token refresh failed:', error);
            auth.logout();
            useRouter().push('/login');
          }
        } else if (auth.shouldRefreshToken()) {
          try {
            await auth.refreshAuthToken();
          } catch (error) {
            console.warn('Proactive token refresh failed:', error);
          }
        }
      }
    }, 60000); // Check every 60 seconds
  }
});
