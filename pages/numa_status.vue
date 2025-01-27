<template>
  <q-page>
    <q-card>
      <q-card-section>
        <h5 class="q-mt-none q-pt-none">สถานะอุปกรณ์เครือข่าย</h5>
      </q-card-section>
      <q-card-section>
        <iframe :src="machineStatusURL" width="100%" height="800" style="border: none;"></iframe>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import moment from 'moment';

const { public: { machineStatusURL } } = useRuntimeConfig();
export default {
  data() {
    return {
      machineStatusURL
    };
  }
}
console.log(machineStatusURL)
</script>
