import type { Handler, HandlerEvent } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent) => {
  const user = JSON.parse(event.body || '{}')

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['member'],
      },
      user_metadata: {
        ...user.user_metadata,
        signed_up_at: new Date().toISOString(),
      },
    }),
  }
}

export { handler }
