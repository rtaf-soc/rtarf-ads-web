// export async function fetchStableWeight() {
//   const { public: { scaleURL } } = useRuntimeConfig();
//   const response = await fetch(`${scaleURL}/get`);
//   return response.json();
// }

// export async function getClientDriver() {
//   const { public: { scaleURL } } = useRuntimeConfig();
//   const response = await fetch(`${scaleURL}/getSerialPort`);
//   return response.json();
// }

export async function fetchStableWeight() {
  const { public: { scaleURL } } = useRuntimeConfig();

  try {
    const response = await withTimeout(() =>
      fetch(`${scaleURL}/get`), 2000); // Timeout after 5 seconds

    return await response.json();
  } catch (error) {
    console.error('Request timed out or failed:', error);
    throw error;
  }
}


export async function getClientDriver() {
  const { public: { scaleURL } } = useRuntimeConfig();

  try {
    const response = await withTimeout(() =>
      fetch(`${scaleURL}/getSerialPort`), 2000); // Timeout after 5 seconds

    return await response.json();
  } catch (error) {
    console.error('Request timed out or failed:', error);
    throw error;
  }
}
// export async function setClientDriver(driverPath) {
//   const { public: { scaleURL } } = useRuntimeConfig();
//   const response = await fetch(`${scaleURL}/getSerialPort`);
//   return response.json();
// }
// export async function setClientDriver(driverPath) {
//   const { public: { scaleURL } } = useRuntimeConfig();
//   const response = await fetch(`${scaleURL}/setSerialPort`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ path: driverPath })
//   });
//   return response.json();
// }

export async function setClientDriver(driverPath) {
  const { public: { scaleURL } } = useRuntimeConfig();

  try {
    const response = await withTimeout(() =>
      fetch(`${scaleURL}/setSerialPort`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: driverPath })
      }), 2000); // Timeout after 5 seconds

    return await response.json();
  } catch (error) {
    console.error('Request timed out or failed:', error);
    throw error; // Re-throw the error to handle it in calling functions if needed
  }
}


function withTimeout(fetchPromise, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });

  return Promise.race([fetchPromise(), timeout]);
}