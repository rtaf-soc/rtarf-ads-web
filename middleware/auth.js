// export default defineNuxtRouteMiddleware((to) => {
//     const { $config } = useNuxtApp()
//     if ($config) {
//       console.log('Accessed runtime config within middleware.')
//     }
//     console.log('Heading to', to.path, 'but I think we should go somewhere else...')
//     return '/login'
//   })
  

  // middleware/auth.js

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login');
    }
  });
  
  