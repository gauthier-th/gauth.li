import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBUser, DBFile } from '../types/database'

export type BodyProps = {
  key: string;
  newKey: string;
}

export const key: RouteOptions = {
  method: 'POST',
  url: '/key',
  schema: {
    body: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        newKey: { type: 'string', minLength: 1 },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { key, newKey } = request.body as BodyProps

    const user = await verifyUserAuth(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    await updateUserKey(request.server.pg, user, newKey)

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

async function updateUserKey(pg: PostgresDb, user: DBUser, newKey: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'UPDATE users SET key=$1 WHERE id=$2',
    [ newKey, user.id ],
  )
  return rows.length > 0 ? rows[0] : null
}