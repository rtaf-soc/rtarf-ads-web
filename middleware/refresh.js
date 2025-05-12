// server/middleware/refresh.js
import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // let the real API run
  await event.node.handler(event)

  if (!event.node.req.url.startsWith('/api/')) return

  const { refreshToken } = await fetch(
    `${event.node.req.headers.host}/api/auth/refresh`,
    {
      method: 'POST',
      headers: { cookie: event.node.req.headers.cookie || '' }
    }
  ).then(r => r.json())

  if (refreshToken) {
    setCookie(event, 'refreshToken', refreshToken, {
      httpOnly: true,
      sameSite:  'lax',
      path:      '/',
    })
  }
})
