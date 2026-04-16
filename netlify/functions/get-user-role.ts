import type { Handler, HandlerEvent } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent, context) => {
  const identity = context.clientContext?.identity
  const user = context.clientContext?.user

  if (!user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized', message: 'No valid JWT token provided' }),
    }
  }

  const roles = user.app_metadata?.roles || user.app_metadata?.authorization?.roles || ['member']

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: user.sub,
      email: user.email,
      roles,
      isAdmin: roles.includes('admin'),
      isMember: roles.includes('member'),
    }),
  }
}

export { handler }
