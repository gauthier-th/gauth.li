import bcrypt from 'bcrypt'
import type { RouteOptions } from 'fastify'
import type { PostgresDb } from '@fastify/postgres'
import type { DBUser } from '../types/database'
import { generateAlphanumId } from '../utils'

export type BodyProps = {
  key: string;
}

export const renewKey: RouteOptions = {
  method: 'POST',
  url: '/renew-key',
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

    const user = await getUserByKey(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    const newKey = generateAlphanumId(40)
    await updateToken(request.server.pg, key, newKey)

    reply.code(200).send({ statusCode: 200, key: newKey })
  },
}

async function getUserByKey(pg: PostgresDb, key: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1',
    [ key ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function updateToken(pg: PostgresDb, oldKey: string, newKey: string): Promise<any> {
  await pg.query(
    'UPDATE users SET key=$2 WHERE key=$1',
    [ oldKey, newKey ],
  )
}