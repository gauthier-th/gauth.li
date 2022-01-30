import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { url } from './url'
import { link } from './link'

const routes: RouteOptions[] = [
  sharex,
  url,
  link,
]

export default routes