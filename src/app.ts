import fastify from 'fastify'
import { authRoutes } from './routes/auth'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import { dietsRoutes } from './routes/diets'

export const app = fastify()

app.register(cookie)
app.register(jwt, {
  secret: 'teste',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

app.register(authRoutes, {
  prefix: 'auth',
})
app.register(dietsRoutes, {
  prefix: 'diets',
})
