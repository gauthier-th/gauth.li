import path from 'path'
import fs from 'fs'
import { getId, getLink, getFile } from '../database'
import type { RouteOptions } from 'fastify'

export const link: RouteOptions = {
  method: 'GET',
  url: '/:id',
  handler: async (request, reply) => {
    let id = (request.params as { id: string }).id

    if (!id)
      return reply.redirect('/app')
    id = id.split(".")[0]

    const idInfos = await getId(request.server.pg, id)

    if (!idInfos)
      throw { statusCode: 401, message: 'Invalid link!' }

    if (idInfos.type === 'file') {
      const file = await getFile(request.server.pg, id)
      if (!file)
        throw { statusCode: 401, message: 'Invalid file!' }

      const stream = fs.createReadStream(path.join(__dirname, '../../uploads/', file.id))

      reply.type(file.mime)
      reply.header('Content-Disposition', `filename="${file.filename}"`)
      reply.send(stream)
    }
    else if (idInfos.type === 'link') {
      const link = await getLink(request.server.pg, id)
      if (!link)
        throw { statusCode: 401, message: 'Invalid link!' }

      reply.redirect(link.link)
    }
  },
}