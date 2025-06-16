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
    const { public: { ckc } } = useRuntimeConfig();
    const externalUrl = ref('');

    onMounted(() => {
      const name = route.params.name;
      
      // Set page title based on route
      titleStore.setTitle(`Cyber Kill Chain - ${name.charAt(0).toUpperCase() + name.slice(1)}`);
      
      // Map the route parameter to the corresponding URL in the config
      switch (name) {
        case 'reconnaissance':
          externalUrl.value = ckc.url01;
          break;
        case 'weaponization':
          externalUrl.value = ckc.url02;
          break;
        case 'delivery':
          externalUrl.value = ckc.url03;
          break;
        case 'exploitation':
          externalUrl.value = ckc.url04;
          break;
        case 'installation':
          externalUrl.value = ckc.url05;
          break;
        case 'command_control':
          externalUrl.value = ckc.url06;
          break;
        case 'actions_objectives':
          externalUrl.value = ckc.url07;
          break;
        default:
          // Default fallback URL
          externalUrl.value = ckc.url01;
      }
      console.log('Cyber Kill Chain URL:', externalUrl.value);
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