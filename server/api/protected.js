// server/api/protected.js
import { verifyToken } from '~/utils/verifyToken';

export default defineEventHandler(async (event) => {
  const authHeader = event.req.headers.authorization;
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Missing Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Malformed token' });
  }

  try {
    const runtimeConfig = useRuntimeConfig();
    const decoded = await verifyToken(token, runtimeConfig);
    return { message: 'Access granted', user: decoded };
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Token verification failed' });
  }
});
