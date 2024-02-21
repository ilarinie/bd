import express from 'express'
import jwt from 'jsonwebtoken'
import { checkLogin } from '../services/userService/checkLogin'
import { env } from '../env'
import { jwtTokenAuth } from '../middlewares/jwtTokenAuth'
import { generateJwtToken } from '../utils/generateJwtToken'
import { createUser } from '../services/userService/createUser'

export const authRouter = express.Router()

authRouter.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).send('Username and password are required')
    return
  }

  const user = await checkLogin(username, password)
  if (!user) {
    res.status(401).send('Invalid username or password')
    return
  }

  const token = generateJwtToken(user)

  res.status(200).send({ token })
})

authRouter.get('/api/checkLogin', jwtTokenAuth, (req, res) => {
  const { username, id } = req.user
  res.status(200).send({ username, id })
})

authRouter.post('/api/createUser', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).send('Username and password are required')
    return
  }

  const user = await createUser(username, password)

  const token = generateJwtToken(user)

  res.status(200).send({ token })
})
