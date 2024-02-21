import { NextFunction, Request, Response } from 'express'
import logger from '../logger'

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`◾  ${req.method} ${req.path}`)
  next()
}
