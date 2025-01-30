<template>
  <q-page>
    <q-card>
      <q-card-section>
        <h5 class="q-mt-none q-pt-none">Geo-IP Attack Map</h5>
      </q-card-section>
      <q-card-section>
        <iframe sandbox="allow-scripts allow-same-origin" :src="urlGeoipAttackMap" width="100%" height="800"
          style="border: none;"></iframe>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import moment from 'moment';

// const { public: { geoIpURL } } = useRuntimeConfig();
export default {
  setup() {
    const { public: { urlGeoipAttackMap } } = useRuntimeConfig();

    // Debugging in the console
    console.log('Geo-IP URL:', urlGeoipAttackMap);

    return {
      urlGeoipAttackMap,
    };
  },
};
// console.log(geoIpURL)
</script>
