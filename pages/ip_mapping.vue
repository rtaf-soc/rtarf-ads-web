<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section style="height: 95vh;">
        <h5 class="q-mt-none q-pt-none">IP Mapping</h5>
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
      Loading.hide()
    })
    const auth = useAuthStore();
    return {
      auth
    }
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },
  // onMounted() {
  //   Loading.hide()
  // },
}
</script>
