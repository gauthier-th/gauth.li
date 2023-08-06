import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBUser, DBFile } from '../types/database'

export type BodyProps = {
  key: string;
  page: number;
}

export type ResponseProps = {
  files: DBFile[];
  pageCount: number;
}

export const files: RouteOptions = {
  method: 'POST',
  url: '/files',
  schema: {
    body: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        page: { type: 'number' },
      },
    }
  },
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }

    const { key, page } = request.body as BodyProps
    const limit = 10;

    const user = await verifyUserAuth(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    const files = await listFiles(request.server.pg, user.id, page, limit)
    const filesCount = await getFilesCount(request.server.pg, user.id);
    const pageCount = Math.ceil(filesCount / 10);
    reply.code(200).send({ statusCode: 200, files, pageCount })
  },
}

async function verifyUserAuth(pg: PostgresDb, key: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1',
    [ key ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function listFiles(pg: PostgresDb, userId: string, page: number = 0, limit: number = 10): Promise<DBFile[]> {
  const { rows } = await pg.query(
    `SELECT * FROM files WHERE "userId"=$1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
    [
      userId,
      limit,
      page * limit,
    ],
  )
  return rows
}

async function getFilesCount(pg: PostgresDb, userId: string) {
  const { rows } = await pg.query(
    'SELECT COUNT(*) FROM files WHERE "userId"=$1',
    [ userId ],
  )
  return rows[0].count
}