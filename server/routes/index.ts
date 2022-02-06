import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { url } from './url'
import { webApp, webAppRedirect } from './web-app'
import { link } from './link'
import { login } from './login'
import { files } from './files'
import { del } from './delete'

const routes: RouteOptions[] = [
  sharex,
  url,
  webAppRedirect,
  webApp,
  link,
  login,
  files,
  del,
]

export default routes