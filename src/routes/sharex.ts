import { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'

export const sharex: RouteOptions = {
  method: 'POST',
  url: '/sharex',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' }
        }
      }
    }
  },
  handler: async (request, reply) => {
    const data = await request.file()
    if (!data || Array.isArray(data.fields.key))
      throw { statusCode: 400, message: 'Invalid body!' }

    const key = (data.fields.key as any).value;
    if (!(await keyAllowed(request.server.pg, key)))
      throw { statusCode: 401, message: 'Invalid key!' }

    console.log(data.filename)
    return { message: 'Successfully uploaded!' }
  },
}

async function keyAllowed(pg: PostgresDb, key: string) {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1', [key],
  )
  return rows.length > 0
}