import { FastifyInstance } from 'fastify'

export const dietsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })
  app.addHook('onRequest', (request) => request.jwtVerify())

  app.get('/', async (request, reply) => {
    return reply.send()
  })
}
