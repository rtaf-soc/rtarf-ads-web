<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <!-- <q-card-section>
        <h5 class="q-ma-none q-pt-none">ภาพรวม</h5>
      </q-card-section> -->
      <q-card-section>
        <div v-if="overViewOnLoad[0].link" class="loading-container q-pt-lx">
                <q-spinner size="50px" />
              </div>
              <iframe sandbox="allow-scripts allow-same-origin" :src="overViewArray[0].link" width="100%"  height="800"
                :onLoad="isFrameLoad(0)" style="border: none;">
              </iframe>
      </q-card-section>
      <!-- <q-card-section>
        <div class="row q-ma-none">
          <div class="col-12 col-md-6" style="height: 480px">
            <div class="q-pa-sm">
              <div v-if="overViewOnLoad[0].link" class="loading-container q-pt-lx">
                <q-spinner size="50px" />
              </div>
              <iframe sandbox="allow-scripts allow-same-origin" :src="overViewArray[0].link" width="100%" height="480"
                :onLoad="isFrameLoad(0)" style="border: none;">
              </iframe>
            </div>
          </div>
          <div class="col-12 col-md-6" style="height: 480px">
            <div class="q-pa-sm">
              <div v-if="overViewOnLoad[1].link" class="loading-container q-pt-lx">
                <q-spinner size="50px" />
              </div>
              <iframe sandbox="allow-scripts allow-same-origin" :src="overViewArray[1].link" width="100%" height="480"
                :onload="isFrameLoad(1)" style="border: none;">
              </iframe>
            </div>
          </div>
        </div>
        <div class="row q-pa-none q-ma-none q-pt-md">
          <div class="col-12 col-md-6" style="height: 480px">
            <div class="q-pa-sm">
              <div v-if="overViewOnLoad[2].link" class="loading-container q-pt-lx">
                <q-spinner size="50px" />
              </div>
              <iframe sandbox="allow-scripts allow-same-origin" :src="overViewArray[2].link" width="100%" height="480"
                :onload="isFrameLoad(2)" style="border: none;">
              </iframe>
            </div>
          </div>
          <div class="col-12 col-md-6" style="height: 480px">
            <div class="q-pa-sm">
              <div v-if="overViewOnLoad[3].link" class="loading-container q-pt-lx">
                <q-spinner size="50px" />
              </div>
              <iframe sandbox="allow-scripts allow-same-origin" :src="overViewArray[3].link" width="100%" height="480"
                :onload="isFrameLoad(3)" style="border: none;">
              </iframe>
            </div>
          </div>
        </div>
      </q-card-section> -->
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
        link: 'mockx.com'
      },
      {
        link: 'mockx.com'
      },
      {
        link: 'mockx.com'
      },
      {
        link: 'mockx.com'
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
          // Use a raw JSON body as expected by your API:
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
    // mounted(() => {
    //   Loading.hide()
    //   fetchOverview();
    // });

    return {
      overviewData,
      auth,
      overViewArray,
      overViewOnLoad,
      isFrameLoad
    };
  },
  beforeMount() {
    // This registers your global auth middleware which checks if the user is authenticated.
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