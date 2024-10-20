// stores/weight.js
import { defineStore } from 'pinia';

export const useWeightStore = defineStore('weight', {
  state: () => ({
    weight: 'Waiting for data...'
  }),
  actions: {
    setWeight(newWeight) {
      this.weight = newWeight;
    }
  }
});
