import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export const usersRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      password: z.string(),
    })
    const { name, password } = createUserSchema.parse(request.body)
    const hash = bcrypt.hashSync(password, 10)
    await knex('users').insert({
      id: randomUUID(),
      name,
      password: hash,
    })
    return reply.status(201).send()
  })
}
