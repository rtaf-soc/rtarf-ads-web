// // plugins/websocket.js

// export default defineNuxtPlugin((nuxtApp) => {
//   if (process.client) {
//     const ws = new WebSocket('ws://localhost:8080');

//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log('Data received:', data);  // Log data to ensure it's received
//       const weightStore = useWeightStore(nuxtApp.pinia);  // Correctly access the store using Pinia
//       weightStore.setWeight(data.weight);  // Call action directly
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }
// });

// plugins/websocket.js

// plugins/websocket.js

export default defineNuxtPlugin((nuxtApp) => {
  let ws = null;

  const openWebSocket = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log('Data received:', data);
        const weightStore = useWeightStore(nuxtApp.pinia);
        weightStore.setWeight(data.weight);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  };

  const closeWebSocket = () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  // Expose functions globally
  nuxtApp.provide('websocket', { openWebSocket, closeWebSocket });
});

