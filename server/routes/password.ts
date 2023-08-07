import bcrypt from 'bcrypt'
import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBUser } from '../types/database'

export type BodyProps = {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export const password: RouteOptions = {
  method: 'POST',
  url: '/password',
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { username, currentPassword, newPassword } = request.body as BodyProps

    const user = await findUser(request.server.pg, username)
    if (!user)
      throw { statusCode: 401, message: 'Invalid username/password!' }
    if (!await bcrypt.compare(currentPassword, user.password))
      throw { statusCode: 401, message: 'Invalid username/password!' }

    await updateUserPassword(request.server.pg, username, await bcrypt.hash(newPassword, 10))

    reply.code(200).send({ statusCode: 200 })
  },
}

async function findUser(pg: PostgresDb, username: string): Promise<DBUser | null> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE username=$1',
    [ username ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function updateUserPassword(pg: PostgresDb, username: string, newPassword: string): Promise<any> {
  await pg.query(
    'UPDATE users SET password=$2 WHERE username=$1',
    [ username, newPassword ],
  )
}