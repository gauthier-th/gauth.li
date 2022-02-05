import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBUser } from '../types/database'

export type BodyProps = {
  key: string;
}

export const login: RouteOptions = {
  method: 'POST',
  url: '/login',
  schema: {
    body: {
      type: 'object',
      properties: {
        key: { type: 'string' },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { key } = request.body as BodyProps

    const user = await verifyUserAuth(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    reply.code(200).send({ statusCode: 200 })
  },
}

async function verifyUserAuth(pg: PostgresDb, key: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1',
    [ key ],
  )
  return rows.length > 0 ? rows[0] : null
}