// server/api/login.js
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const form = new URLSearchParams({
    grant_type: 'password',
    response_type:'token',
    scope:"openid",
    client_id: config.keycloak.idpClientId,
    client_secret: config.keycloak.idpClientSecret,
    username: body.username,
    password: body.password
  });

  // console.log('start login')
  // console.log(form)
  try {
    const tokenResponse = await $fetch(config.keycloak.idpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    // console.log(tokenResponse)
    console.log(`${body.username} logged in`)
    return tokenResponse;
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to login to Keycloak'
    });
  }
});

