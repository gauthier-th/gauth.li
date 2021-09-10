import path from 'path'
import fs from 'fs'
import type { RouteOptions } from 'fastify'
import type { DBFile } from '../types'
import type { PostgresDb } from 'fastify-postgres'

export const image: RouteOptions = {
  method: 'GET',
  url: '/i/:id',
  handler: async (request, reply) => {
    const fileId = (request.params as { id: string }).id;
    const file = await getFile(request.server.pg, fileId);
    if (!file)
      throw { statusCode: 401, message: 'Invalid file!' }

    const stream = fs.createReadStream(path.join(__dirname, '../../uploads/', file.id))

    reply.type(file.mime);
    reply.send(stream);
  },
}

async function getFile(pg: PostgresDb, id: string): Promise<DBFile> {
  const { rows } = await pg.query(
    'SELECT * FROM files WHERE id=$1',
    [ id ],
  )
  return rows.length > 0 ? rows[0] : null
}