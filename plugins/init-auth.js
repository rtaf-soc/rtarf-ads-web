export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      const auth = useAuthStore();
      auth.loadFromLocalStorage();
    }
  });
  