import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { link } from './link'

const routes: RouteOptions[] = [
  sharex,
  link,
]

export default routes