import type { RouteOptions } from 'fastify'
import type { PostgresDb } from '@fastify/postgres'
import type { DBUser, DBFile } from '../types/database'

export type BodyProps = {
  key: string;
}
export type QueryProps = {
  id: string;
}

export const del: RouteOptions = {
  method: 'POST',
  url: '/delete/:id',
  schema: {
    body: {
      type: 'object',
      properties: {
        key: { type: 'string' },
      },
    },
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { key } = request.body as BodyProps
    const { id } = request.params as QueryProps

    const user = await verifyUserAuth(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    const file = await getFile(request.server.pg, id)
    if (!file)
      throw { statusCode: 401, message: 'Invalid file!' }

    if (file.userId !== user.id)
      throw { statusCode: 401, message: 'Invalid file!' }

    await deleteFile(request.server.pg, id)

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

async function getFile(pg: PostgresDb, id: string): Promise<DBFile> {
  const { rows } = await pg.query(
    'SELECT * FROM files WHERE id=$1',
    [ id ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function deleteFile(pg: PostgresDb, id: string): Promise<void> {
  await pg.query(
    'DELETE FROM files WHERE id=$1',
    [ id ],
  )
}