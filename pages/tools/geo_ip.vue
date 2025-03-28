<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section>
        <h5 class="q-mt-none q-pt-none">GeoIP</h5>
      </q-card-section>
      <q-card-section>
        <iframe sandbox="allow-scripts allow-same-origin" :src="toolUrl05" width="100%" height="800"
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
    const { public: { toolUrl05 } } = useRuntimeConfig();
    const auth = useAuthStore();
    return {
      toolUrl05,
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
