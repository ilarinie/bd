import winston from 'winston'

export const createLogger = () => {
  const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${new Date(timestamp).toLocaleTimeString('DE')} ${level}: ${message}`
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  })

  if (process.env.NODE_ENV === 'production') {
    logger.level = 'info'
  }

  if (process.env.NODE_ENV === 'test') {
    logger.level = 'error'
  }
  return logger
}

const logger = createLogger()

export default logger
