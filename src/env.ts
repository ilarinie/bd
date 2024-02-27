import { coerce, object, string } from 'zod'

const EnvSchema = object({
  VITE_DATABASE_URL: string(),
  VITE_JWT_SECRET: string(),
  VITE_PORT: coerce.number(),
})

export const env = EnvSchema.parse(process.env)
