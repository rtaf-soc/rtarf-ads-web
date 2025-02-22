// /server/api/hello.js
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
    return { message: 'Hello from the backend!, '+ config.apiPath }
  })
  