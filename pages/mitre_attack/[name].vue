<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <iframe v-if="externalUrl" sandbox="allow-scripts allow-same-origin" :src="externalUrl" width="100%" height="100%"
          style="border: none;"></iframe>
        <div v-else class="flex flex-center q-pa-xl">
          <q-spinner size="3em" color="primary" />
          <p class="q-ml-md">Loading...</p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from '~/stores/auth'
import { useTitleStore } from '~/stores/title'

export default {
  setup() {
    const route = useRoute();
    const auth = useAuthStore();
    const titleStore = useTitleStore();
    const { public: { mitr } } = useRuntimeConfig();
    const externalUrl = ref('');

    onMounted(() => {
      const name = route.params.name;
      
      // Set page title based on route
      titleStore.setTitle(`MITRE ATT&CK - ${name.charAt(0).toUpperCase() + name.slice(1)}`);
      
      // Determine which URL to use based on the route parameter
      if (name === 'main') {
        externalUrl.value = mitr.url01;
      } else {
        // Handle other potential parameters or provide a default
        externalUrl.value = mitr.url01;
      }
      console.log('MITRE URL:', externalUrl.value);
    });

    return {
      auth,
      externalUrl
    }
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },
}
</script>