<template>
  <div v-if="loading" class="loading-container">
    <!-- Optional: Show a spinner while loading -->
    <q-spinner size="50px" />
  </div>
  <div v-else>
    <div v-if="auth.isAuthenticated">

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '~/stores/auth'
// import { Loading } from 'quasar'

// Loading.show()
export default {
  setup() {
    onMounted(() => {
      // Loading.hide()
    })
    const auth = useAuthStore();
    return {
      auth,
    }
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },

}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
