// store/index.js

export const state = () => ({
    weight: 'Waiting for data...'
  });
  
  export const mutations = {
    setWeight(state, weight) {
      state.weight = weight;
    }
  };
  