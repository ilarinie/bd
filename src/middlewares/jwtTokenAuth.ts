import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../env'
import { number, object, string } from 'zod'
import { prismaClient } from '../db'

const JWTSchema = object({
  id: string(),
  username: string(),
  exp: number(),
  iat: number(),
})

export const jwtTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }
  const bearerToken = authHeader.split(' ')[1]

  if (!bearerToken) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }
  let verifiedToken
  try {
    verifiedToken = jwt.verify(bearerToken, env.VITE_JWT_SECRET)
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  const token = JWTSchema.parse(verifiedToken)

  const user = await prismaClient.user.findUnique({
    where: {
      id: token.id,
    },
  })

  if (!user) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  req.user = user
  next()
}
