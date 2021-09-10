import { RouteOptions } from 'fastify'

export const sharex: RouteOptions = {
  method: 'POST',
  url: '/sharex',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          exit_code: { type: 'number' },
          error: { type: 'string' }
        }
      }
    }
  },
  handler: async (request, reply) => {
    const data = await request.file()
    if (!data || Array.isArray(data.fields.key))
      return { exit_code: 1, error: 'Invalid request' }
    const key = (data.fields.key as any).value;
    if (key !== 'abcdefgh')
      return { exit_code: 2, error: 'Unknown key' }
    console.log(data.filename, key)
    return { exit_code: 0, error: null }
  },
}