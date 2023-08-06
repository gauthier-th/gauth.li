import { generateId } from '../utils'
import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { DBLink, DBUser } from '../types/database'

export const url: RouteOptions = {
  method: 'POST',
  url: '/url',
  handler: async (request, reply) => {
    if (!request.body)
      throw { statusCode: 400, message: 'Invalid body!' }
    const { key, url } = (request.body as { key: string; url: string })

    const user = await getUserByKey(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    const link = await saveLink(request.server.pg, url, user)

    return { message: 'Successfully uploaded!', link }
  },
}

async function getUserByKey(pg: PostgresDb, key: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1',
    [ key ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function saveLink(pg: PostgresDb, url: string, user: DBUser): Promise<DBLink> {
  const link: DBLink = {
    id: generateId(),
    link: url,
    userId: user.id,
    createdAt: Date.now()
  }

  await pg.query(
    'INSERT INTO ids ("id", "type") VALUES ($1, $2)',
    [ link.id, 'link' ],
  )
  await pg.query(
    'INSERT INTO links ("id", "link", "userId", "createdAt") VALUES ($1, $2, $3, to_timestamp($4))',
    [ link.id, link.link, link.userId, Math.round(link.createdAt / 1000)],
  )

  return link
}