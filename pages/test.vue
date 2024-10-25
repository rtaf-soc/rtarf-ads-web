<template>
  <div>
    <h1>Real-time Weight</h1>
    <p>{{ weight }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      weight: state => state.weight
    })
  }
};
</script>
