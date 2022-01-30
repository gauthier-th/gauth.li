import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { url } from './url'
import { webApp } from './web-app'
import { link } from './link'

const routes: RouteOptions[] = [
  sharex,
  url,
  webApp,
  link,
]

export default routes