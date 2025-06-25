<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <div v-if="!overViewArray[0].link || overViewArray[0].link === 'mockx.com'" class="flex flex-center q-pa-xl">
          <q-spinner size="3em" color="primary" />
          <p class="q-ml-md">Loading...</p>
        </div>
        <iframe 
          v-else 
          sandbox="allow-scripts allow-same-origin" 
          :src="overViewArray[0].link" 
          width="100%" 
          height="100%"
          style="border: none;">
        </iframe>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from '~/stores/auth';

export default {
  setup() {
    onMounted(() => {
      Loading.hide()
      fetchOverview();
    })
    const auth = useAuthStore();
    const overviewData = ref(null);
    const overViewArray = ref([
      {
        link: ''
      },
      {
        link: ''
      },
      {
        link: ''
      },
      {
        link: ''
      }
    ])

    const overViewOnLoad = ref([
      {
        link: true
      },
      {
        link: true
      },
      {
        link: true
      },
      {
        link: true
      }
    ])
    
    function isFrameLoad(index) {
      overViewOnLoad.value[index].link = false
    }
    
    async function fetchOverview() {
      Loading.show()
      overViewOnLoad.value[0].link = true
      overViewOnLoad.value[1].link = true
      overViewOnLoad.value[2].link = true
      overViewOnLoad.value[3].link = true
      try {
        const accessToken = localStorage.getItem('accessToken');

        overviewData.value = await $fetch('/api/overview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({ FullTextSearch: "" })
        });

        for (let index = 0; index < 4; index++) {
          overViewArray.value[index]['link'] = overviewData.value[index].variableValue;
          console.log(overViewArray)
        }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        Loading.hide()
      }
    }

    return {
      overviewData,
      auth,
      overViewArray,
      overViewOnLoad,
      isFrameLoad
    };
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    });
  }
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: top;
  height: 100vh;
}
</style>