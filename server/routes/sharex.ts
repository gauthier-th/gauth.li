import path from 'path'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import { generateId } from '../utils'
import type { RouteOptions } from 'fastify'
import type { PostgresDb } from 'fastify-postgres'
import type { MultipartFile } from 'fastify-multipart'
import type { DBFile, DBUser } from '../types/database'

const pump = util.promisify(pipeline)

export const sharex: RouteOptions = {
  method: 'POST',
  url: '/sharex',
  handler: async (request, reply) => {
    const data = await request.file()
    if (!data ||!data.fields.key || Array.isArray(data.fields.key))
      throw { statusCode: 400, message: 'Invalid body!' }

    const key = (data.fields.key as any).value
    const user = await getUserByKey(request.server.pg, key)
    if (!user)
      throw { statusCode: 401, message: 'Invalid key!' }

    const file = await saveFile(request.server.pg, data, user)

    return { message: 'Successfully uploaded!', file }
  },
}

async function getUserByKey(pg: PostgresDb, key: string): Promise<DBUser> {
  const { rows } = await pg.query(
    'SELECT * FROM users WHERE key=$1',
    [ key ],
  )
  return rows.length > 0 ? rows[0] : null
}

async function saveFile(pg: PostgresDb, data: MultipartFile, user: DBUser): Promise<DBFile> {
  const file: DBFile = {
    id: generateId(),
    filename: data.filename,
    mime: data.mimetype,
    userId: user.id,
    createdAt: Date.now()
  }

  await pg.query(
    'INSERT INTO ids ("id", "type") VALUES ($1, $2)',
    [ file.id, 'file' ],
  )
  await pg.query(
    'INSERT INTO files ("id", "filename", "mime", "userId", "createdAt") VALUES ($1, $2, $3, $4, to_timestamp($5))',
    [ file.id, file.filename, file.mime, file.userId, Math.round(file.createdAt / 1000)],
  )

  const stream = fs.createWriteStream(path.join(__dirname, '../../uploads/', file.id))
  await pump(data.file, stream)

  return file
}