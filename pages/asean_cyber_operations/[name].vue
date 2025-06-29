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
    const { public: { aco } } = useRuntimeConfig();
    const externalUrl = ref('');

    onMounted(() => {
      const name = route.params.name;
      // Format name: replace underscores with spaces and capitalize each word
      const formattedName = name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      // Set page title based on formatted name
      titleStore.setTitle(`ASEAN Cyber Operations - ${formattedName}`);
      // Map the route parameter to the corresponding URL in the config
      switch (name) {
        case 'cambodia':
          externalUrl.value = aco.url01;
          console.log('Cambodia URL:', externalUrl.value);
          break;
        case 'myanmar':
          externalUrl.value = aco.url02;
          console.log('Myanmar URL:', externalUrl.value);
          break;
        case 'malaysia':
          externalUrl.value = aco.url03;
          console.log('Malaysia URL:', externalUrl.value);
          break;
        case 'laos':
          externalUrl.value = aco.url04;
          console.log('Laos URL:', externalUrl.value);
          break;
        case 'vietnam':
          externalUrl.value = aco.url05;
          break;
        case 'china':
          externalUrl.value = aco.url06;
          break;
        case 'north_korea':
          externalUrl.value = aco.url07;
          break;
        default:
          // Default fallback URL
          externalUrl.value = aco.url01;
      }
      console.log('ASEAN Cyber Operations URL:', externalUrl.value); // Add logging
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