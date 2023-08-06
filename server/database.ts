import { generateAlphanumId } from './utils'
import type { DBUser, DBId, DBFile, DBLink } from './types/database'
import type { PostgresDb } from 'fastify-postgres'

export async function getUser(pg: PostgresDb, id: string) {
  return getDatabaseItem<DBUser>(pg, 'users', id)
}
export async function getId(pg: PostgresDb, id: string) {
  return getDatabaseItem<DBId>(pg, 'ids', id)
}
export async function getFile(pg: PostgresDb, id: string) {
  return getDatabaseItem<DBFile>(pg, 'files', id)
}
export async function getLink(pg: PostgresDb, id: string) {
  return getDatabaseItem<DBLink>(pg, 'links', id)
}
export async function getDatabaseItem<T>(pg: PostgresDb, table: string, id: string): Promise<T> {
  const { rows } = await pg.query(
    `SELECT * FROM ${table} WHERE id=$1`,
    [ id ],
  )
  return rows.length > 0 ? rows[0] : null
}

export async function generateId(pg: PostgresDb): Promise<string> {
  let id: string
  do {
    id = generateAlphanumId()
  } while (await getId(pg, id))
  return id
}