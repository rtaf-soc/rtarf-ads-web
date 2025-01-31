// /server/api/hello.js
export default defineEventHandler(() => {
    return { message: 'Hello from the backend!, '+ process.env.API_PATH }
  })
  