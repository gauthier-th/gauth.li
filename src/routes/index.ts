import { RouteOptions } from 'fastify'

import { ping } from './ping'

const routes: RouteOptions[] = [
  ping
]

export default routes