<template>

    <div v-if="auth.isAuthenticated">

    </div>
 
</template>

<script>
import { useAuthStore } from '~/stores/auth'
// import { Loading } from 'quasar'

// Loading.show()
export default {
  setup() {
    onMounted(() => {
      Loading.hide()
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
