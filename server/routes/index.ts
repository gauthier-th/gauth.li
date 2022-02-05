import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { url } from './url'
import { webApp } from './web-app'
import { link } from './link'
import { login } from './login'

const routes: RouteOptions[] = [
  sharex,
  url,
  webApp,
  link,
  login,
]

export default routes