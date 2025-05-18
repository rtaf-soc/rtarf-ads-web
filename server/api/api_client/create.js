import { readBody, createError } from 'h3'
import { Buffer } from 'buffer'
import { error } from 'console'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rulesApi = config.apiPath + '/api/Blacklist/org/default/action/AddBlackList'

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
  const encodedToken = Buffer.from(token).toString('base64')

  // ✅ Parse body sent from client
  const data = await readBody(event)
  console.log(data)
  try {
    if (config.debugMode) {
      console.log('📡 Sending Request:')
      console.log('URL:', rulesApi)
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodedToken}`
      })
      console.log('Body:', data)
    }

    const response = await $fetch(rulesApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodedToken}`
      },
      body: JSON.stringify(data)
    })
    console.log(response)
    if (response.description != "Success") {
      throw error
    }
    return response
  } catch (error) {
    console.error('Error calling create API:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to blacklist create data'
    })
  }
})
