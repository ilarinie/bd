import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('App', () => {
  it('should run tests', () => {
    expect(true).toBe(true)
  })
  it('should have working healthcheck', async () => {
    const resp = await request(app).get('/')
    expect(resp.status).toBe(200)
  })
  it('should start via index', async () => {
    import('../index')
  })
})
