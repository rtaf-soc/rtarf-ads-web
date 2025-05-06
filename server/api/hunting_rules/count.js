import { readBody, createError } from 'h3'
import { Buffer } from 'buffer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const countApi = config.apiPath + '/api/HuntingRule/org/default/action/GetHuntingRuleCount'

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

    const response = await $fetch(countApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodedToken}`
      },
      body: JSON.stringify({
        offset: 0,
        fromDate: "2025-05-05T17:56:35.528Z",
        toDate: "2025-05-06T17:56:35.528Z",
        limit: 0,
        fullTextSearch: data.fullTextSearch,
        refType: data.refType
      })
    })
    console.log('count')
    console.log(response)
    return response
  } catch (error) {
    console.error('Error calling overview API:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch overview data'
    })
  }
})
