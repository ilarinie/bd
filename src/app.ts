import express from 'express'
import { authRouter } from './routers/authRouter'
import bodyParser from 'body-parser'
import cors from 'cors'
import { loggerMiddleware } from './middlewares/loggerMiddleware'
import { budgetRouter } from './routers/budgetRouter'

export const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(loggerMiddleware)

app.get('/', (req, res) => {
  res.send('Healthcheck OK!')
})

app.use(authRouter)
app.use(budgetRouter)
