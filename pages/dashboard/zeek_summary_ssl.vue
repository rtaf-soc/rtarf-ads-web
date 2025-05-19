<template>
    <q-page v-if="auth.isAuthenticated">
      <q-card>
        <!-- <q-card-section class="q-pb-none">
            <h5 class="q-pa-none q-ma-none">Zeek Summary (Radius)</h5>
        </q-card-section> -->
        <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
          <iframe sandbox="allow-scripts allow-same-origin" :src="url09" width="100%" height="100%"
            style="border: none;"></iframe>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  
  
  <script>
  import { useAuthStore } from '~/stores/auth'
  // Loading.show()
  export default {
    setup() {
      onMounted(() => {
        // Loading.hide()
      })
      const { public: { dashboard: { url09 } } } = useRuntimeConfig();
      const auth = useAuthStore();
      return {
        url09,
        auth
      }
    },
    beforeMount() {
      definePageMeta({
        middleware: 'auth'
      })
    },
  
  }
  </script>
  