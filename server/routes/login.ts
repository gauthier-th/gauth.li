import bcrypt from 'bcrypt'
import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBUser } from '../types/database'

export type BodyProps = {
  username: string;
  password: string;
}

export const login: RouteOptions = {
  method: 'POST',
  url: '/login',
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { username, password } = request.body as BodyProps

    const user = await findUser(request.server.pg, username)
    if (!user)
      throw { statusCode: 401, message: 'Invalid username/password!' }
    if (!await bcrypt.compare(password, user.password))
      throw { statusCode: 401, message: 'Invalid username/password!' }

    const { key } = user

    reply.code(200).send({ statusCode: 200, key })
  },
}

async function findUser(pg: PostgresDb, username: string): Promise<DBUser | null> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE username=$1',
    [ username ],
  )
  return rows.length > 0 ? rows[0] : null
}