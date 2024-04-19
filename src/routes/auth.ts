import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export const authRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/sign-up', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      password: z.string().max(64),
    })
    const { name, password } = createUserSchema.parse(request.body)
    const hash = await bcrypt.hash(password, 10)
    await knex('users').insert({
      id: randomUUID(),
      name,
      password: hash,
    })
    return reply.status(201).send()
  })

  app.post('/sign-in', async (request, reply) => {
    const getUserSchema = z.object({
      name: z.string(),
      password: z.string(),
    })
    const { name, password } = getUserSchema.parse(request.body)
    await knex('users')
      .select()
      .where({
        name,
      })
      .first()
      .then((user) => {
        if (user) {
          return {
            user,
            isEquals: bcrypt.compare(password, user.password),
          }
        } else reply.status(400).send({ message: 'Usuário não existente' })
      })
      .then(async (data) => {
        if (data?.isEquals) {
          await knex('users')
            .update({
              lastLogin: knex.fn.now(),
            })
            .where({
              id: data.user.id,
            })
          const token = app.jwt.sign(
            { id: data.user.id, name },
            { expiresIn: 60 * 5 },
          )
          return reply
            .setCookie('token', token, {
              path: '/',
              secure: false, // send cookie over HTTPS only
              httpOnly: false,
              sameSite: true, // alternative CSRF protection
            })
            .status(200)
            .send({
              message: 'Usuário autenticado com sucesso!',
            })
        } else {
          return reply
            .status(401)
            .send({ message: 'As credenciais não coincidem' })
        }
      })
  })
  app.post('/sign-out', async (request, reply) => {
    const { token } = request.cookies

    if (token) {
      return reply.clearCookie('token').status(200).send()
    }
  })
}
