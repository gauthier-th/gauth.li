import { RouteOptions } from 'fastify'

import { sharex } from './sharex'
import { url } from './url'
import { webAppRedirect } from './web-app'
import { link } from './link'
import { login } from './login'
import { files } from './files'
import { del } from './delete'
import { password } from './password'
import { renewKey } from './renew-key'

const routes: RouteOptions[] = [
  sharex,
  url,
  webAppRedirect,
  link,
  login,
  files,
  del,
  password,
  renewKey,
]

export default routes