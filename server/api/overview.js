import { readBody, createError } from 'h3'
import { Buffer } from 'buffer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Use the API path from runtime config (or set a default)
  const apiPath = config.apiPath + '/api/SystemVariable/org/default/action/GetSystemVariables'

  // Retrieve the access token from the Authorization header
  const authHeader = event.node.req.headers.authorization
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing Authorization header'
    })
  }
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid Authorization header format'
    })
  }
  const token = parts[1]

  // Base64-encode the access token
  const encodedToken = Buffer.from(token).toString('base64')

  // Prepare the JSON data (raw format as required)
  const data = { FullTextSearch: "" }

  try {
    // Call your API endpoint using $fetch
    const response = await $fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodedToken}`
      },
      // $fetch accepts a body; we stringify it to ensure JSON raw format
      body: JSON.stringify(data)
    })
    return response
  } catch (error) {
    console.error('Error calling overview API:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch overview data'
    })
  }
})
