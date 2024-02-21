import { app } from './app'
import { env } from './env'
import logger from './logger'

app.listen(env.VITE_PORT, () => {
  logger.info(`Server is 🙉 on port ${env.VITE_PORT} ✅`)
})
