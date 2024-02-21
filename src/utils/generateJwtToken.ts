import { User } from '@prisma/client'
import { env } from '../env'
import jwt from 'jsonwebtoken'

export const generateJwtToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    env.VITE_JWT_SECRET,
    {
      expiresIn: '8d',
    },
  )
}
