<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section>
        <h5 class="q-mt-none q-pt-none">Approve #4</h5>
      </q-card-section>
      <q-card-section>
        <iframe sandbox="allow-scripts allow-same-origin" :src="toolUrl044" width="100%" height="800"
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
    const { public: { toolUrl044 } } = useRuntimeConfig();
    const auth = useAuthStore();
    return {
      toolUrl044,
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
