import Fastify, { FastifyInstance } from 'fastify'
import routes from './routes'
import fastifyMultipart from 'fastify-multipart'
import fastifyPostgres from 'fastify-postgres'

const server: FastifyInstance = Fastify({
  logger: process.env.NODE_ENV !== 'production'
})

server.register(fastifyMultipart)
server.register(fastifyPostgres, {
  connectionString: process.env.CONNECTION_STRING
})

export async function start() {
  try {
    registerRoutes()

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
    await server.listen(port)
    console.log('Server listening on port ' + port)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

function registerRoutes() {
  for (let route of routes) {
    server.route(route)
  }
}