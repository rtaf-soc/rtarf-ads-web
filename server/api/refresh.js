// server/api/refresh.js
import { readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing refresh token'
    });
  }
  
  const config = useRuntimeConfig();
  console.log(config)
  const form = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.keycloak.idpClientId,
    client_secret: config.keycloak.idpClientSecret,
    refresh_token: body.refreshToken
  });
  
  try {
    const tokenResponse = await $fetch(config.keycloak.idpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    });
    return tokenResponse;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to refresh token on server'
    });
  }
});
