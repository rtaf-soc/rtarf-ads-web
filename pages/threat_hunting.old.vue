<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>

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
      fetchData()
    })
    const tableData = ref([])
    const auth = useAuthStore();
    async function fetchData() {
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');

        let data = await $fetch('/api/hunting_rules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify({
            offset: 1,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-05T17:56:35.528Z",
            limit: 5,
            fullTextSearch: "",
            refType: "Sigma"
          })


        });
        console.log(data)
        // for (let index = 0; index < 4; index++) {
        //   overViewArray.value[index]['link'] = overviewData.value[index].variableValue;
        //   console.log(data)
        // }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        Loading.hide()
      }
    }
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
