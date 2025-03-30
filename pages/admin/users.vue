<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <!-- <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          users</h5>
      </q-card-section> -->

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
