<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section>
        <h5 class="q-mt-none q-pt-none">Geo-IP Attack Map</h5>
      </q-card-section>
      <q-card-section>
        <iframe sandbox="allow-scripts allow-same-origin" :src="geoIpURL" width="100%" height="800"
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
    const { public: { geoIpURL } } = useRuntimeConfig();
    const auth = useAuthStore();
    return {
      geoIpURL,
      auth
    }
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },
  onMounted(){
    // Loading.hide()
  },
}
</script>
