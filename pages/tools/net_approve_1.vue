<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          Approve #1</h5>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <iframe sandbox="allow-scripts allow-same-origin" :src="url041" width="100%" height="100%"
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
    const { public: { tool : {url041 } }} = useRuntimeConfig();
    const auth = useAuthStore();
    return {
      url041,
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
