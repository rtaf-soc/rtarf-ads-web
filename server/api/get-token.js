// // server/api/get-token.js
// export default defineEventHandler(async (event) => {
//     const config = useRuntimeConfig();
  
//     // Prepare URL-encoded POST data
//     const body = new URLSearchParams({
//       scope:"openid",
//       client_id: process.env.NUXT_KEYCLOAK_IDP_CLIENT_ID,
//       client_secret: process.env.NUXT_KEYCLOAK_IDP_CLIENT_SECRET,
//       grant_type: 'client_credentials'
//     });

//     try {
//       // Use the idpEndpoint from runtime config for the token request
//       const tokenResponse = await $fetch(process.env.NUXT_KEYCLOAK_IDP_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: body.toString()
//       });
//       return tokenResponse;
//     } catch (error) {
//       throw createError({
//         statusCode: error.response?.status || 500,
//         statusMessage: 'Failed to obtain token from Keycloak'
//       });
//     }
//   });
  