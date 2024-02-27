import { describe, expect, it } from 'vitest'
import { createLogger } from '..'

describe('Logger', () => {
  it('should set log levels correctly', () => {
    process.env.NODE_ENV = 'production'
    let logger = createLogger()
    expect(logger.level).toBe('info')

    process.env.NODE_ENV = 'test'
    logger = createLogger()
    expect(logger.level).toBe('error')

    process.env.NODE_ENV = 'development'
    logger = createLogger()
    expect(logger.level).toBe('debug')
  })
})
