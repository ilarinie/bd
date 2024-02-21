import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
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

export default logger
