import express from 'express'
import { jwtTokenAuth } from '../middlewares/jwtTokenAuth'
import { generateJwtToken } from '../utils/generateJwtToken'
import { createUser, checkLogin } from '../services/userService/'
import { ZodError, number, object, string } from 'zod'

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

const CreateUserSchema = object({
  username: string(),
  password: string(),
  initialIncome: number(),
})

authRouter.post('/api/createUser', async (req, res) => {
  try {
    const userCreateData = CreateUserSchema.parse(req.body)

    const user = await createUser(userCreateData.username, userCreateData.password, userCreateData.initialIncome)

    const token = generateJwtToken(user)

    res.status(200).send({ token })
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).send(err.errors)
      return
    }
    res.status(500).send('Internal server error')
  }
})
