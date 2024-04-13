import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV) {
  config({ path: '.env.test' })
} else {
  config()
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().default(3333),
})

const _env = schema.safeParse(process.env)

if (!_env.success) {
  const message = 'Invalid environment variables!'
  console.error(message, _env.error.format())
  throw new Error(message)
}

export const env = _env.data
