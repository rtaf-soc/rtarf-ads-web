// export default defineNuxtRouteMiddleware((to) => {
//     const { $config } = useNuxtApp()
//     if ($config) {
//       console.log('Accessed runtime config within middleware.')
//     }
//     console.log('Heading to', to.path, 'but I think we should go somewhere else...')
//     return '/login'
//   })


// middleware/auth.js

// export default defineNuxtRouteMiddleware((to, from) => {
//     const authStore = useAuthStore();

//     if (!authStore.isAuthenticated && to.path !== '/login') {
//       return navigateTo('/login');
//     }
//   });



// middleware/auth.js
// export default defineNuxtRouteMiddleware((to, from) => {
//   const authStore = useAuthStore();
  
//   // Update the last activity timestamp on every route change
//   authStore.updateActivity();
  
//   // Check token expiry and log out if necessary
//   authStore.checkTokenExpiry();
  
//   // If not authenticated and not on the login page, redirect to login
//   if (!authStore.isAuthenticated && to.path !== '/login') {
//     return navigateTo('/login');
//   }
// });

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run this check on the client
  if (process.client) {
    const auth = useAuthStore();
    // Ensure the auth store is loaded from localStorage
    auth.loadFromLocalStorage();
    if (!auth.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login');
    }
  }
});
