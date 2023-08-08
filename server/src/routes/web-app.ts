import type { RouteOptions } from 'fastify'

export const webAppRedirect: RouteOptions = {
  method: 'GET',
  url: '/app',
  handler: async (request, reply) => {
    return reply.redirect('/app/')
  },
}
