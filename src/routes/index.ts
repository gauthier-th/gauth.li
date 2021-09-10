import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { image } from './image'

const routes: RouteOptions[] = [
  sharex,
  image,
]

export default routes