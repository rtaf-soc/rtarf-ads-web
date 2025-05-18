import { readBody, createError } from 'h3'
import { Buffer } from 'buffer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

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
    let apiPath = config.apiPath + `/api/${data.apiComponent}/org/${data.orgName}/action/${data.actionName}`
    if (data.apiMethod === "DELETE" || data.actionName.toLowerCase().includes("update")) {
      apiPath = apiPath + `/${data.id}`
    }
    console.log(apiPath)
    const response = await $fetch(apiPath, {
      method: data.apiMethod || "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodedToken}`
      },
      body: JSON.stringify(
        data
      )
    })
    console.log(data.actionName)
    if (data.actionName == "GetIpMapCount") {
      console.log('count')
      console.log(response)
    }
    // console.log('count')
    // console.log(response)
    return response
  } catch (error) {
    console.error('Error calling apiClient API:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch apiClient data'
    })
  }
})
