import path from 'path'
import Fastify, { FastifyInstance } from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyMultipart from '@fastify/multipart'
import fastifyPostgres from '@fastify/postgres'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'
import routes from './routes'

const server: FastifyInstance = Fastify({
  logger: process.env.NODE_ENV !== 'production'
})

server.register(fastifyMultipart)
server.register(fastifyPostgres, {
  connectionString: process.env.CONNECTION_STRING
})
server.register(fastifyFormbody)

if (process.env.NODE_ENV === 'production') {
  server.register(fastifyStatic, {
    root: process.env.APP_BUILD_PATH || path.join(__dirname, '../../app/build/'),
    prefix: '/app/'
  })
  server.setNotFoundHandler((req, res) => {
    if (req.url.startsWith('/app/')) {
      const url = req.url.replace('/app/', '')
      if (url === '')
        res.sendFile('index.html')
      else
        res.sendFile(url + '.html')
    }
  })
}

server.register(fastifyCors, {
  origin: [
    process.env.APP_BASE_URL || 'http://localhost:5173',
    process.env.API_BASE_URL || 'http://localhost:3000',
  ],
})

export async function start() {
  try {
    registerRoutes()

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
    await server.listen({ port, host: '0.0.0.0' })
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