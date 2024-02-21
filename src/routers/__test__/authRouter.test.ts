import request from 'supertest'
import { app } from '../../app'
import { beforeEach, describe, expect, it } from 'vitest'
import { clearDB } from '../../utils/clearDB'
import { createUser } from '../../services/userService/createUser'
import { generateJwtToken } from '../../utils/generateJwtToken'

const testApp = request(app)

const TEST_PASSWORD = 'password'

describe('Auth router', () => {
  describe('Login', () => {
    let user: {
      id: string
      username: string
      hashed_password: string
    }

    beforeEach(async () => {
      await clearDB()
      user = await createUser('test', TEST_PASSWORD)
    })

    it('should return 200 and a valid token for a valid login', async () => {
      const resp = await testApp.post('/api/login').send({
        username: user.username,
        password: TEST_PASSWORD,
      })
      const { token } = resp.body

      expect(token).toBeDefined()
      expect(resp.status).toBe(200)
      expect(token).toEqual(generateJwtToken(user))
    })

    it('should return 400 for a missing username', async () => {
      const resp = await testApp.post('/api/login').send({
        password: TEST_PASSWORD,
      })

      expect(resp.status).toBe(400)
    })

    it('should return 400 for a missing password', async () => {
      const resp = await testApp.post('/api/login').send({
        username: user.username,
      })

      expect(resp.status).toBe(400)
    })

    it('should return 401 for an invalid password', async () => {
      const resp = await testApp.post('/api/login').send({
        username: user.username,
        password: 'invalid_password',
      })

      expect(resp.status).toBe(401)
    })
  })
  describe('Check login', () => {
    let user: {
      id: string
      username: string
      hashed_password: string
    }

    beforeEach(async () => {
      await clearDB()
      user = await createUser('test', TEST_PASSWORD)
    })

    it('should return 200 for a valid token', async () => {
      const token = generateJwtToken(user)
      const resp = await testApp.get('/api/checkLogin').set('Authorization', `Bearer ${token}`)

      expect(resp.status).toBe(200)
      expect(resp.body.username).toBe(user.username)
      expect(resp.body.id).toBe(user.id)
    })

    it('should return 401 for an invalid token', async () => {
      const token = 'invalid token'
      const resp = await testApp.get('/api/checkLogin').set('Authorization', `Bearer ${token}`)

      expect(resp.status).toBe(401)
      expect(resp.body).toEqual({ message: 'Unauthorized' })
    })

    it('should return 401 for a missing token', async () => {
      const resp = await testApp.get('/api/checkLogin')

      expect(resp.status).toBe(401)
      expect(resp.body).toEqual({ message: 'Unauthorized' })
    })
  })

  describe('Create user', () => {
    beforeEach(async () => {
      await clearDB()
    })

    it('should return 200 and a valid token for a valid user', async () => {
      const resp = await testApp.post('/api/createUser').send({
        username: 'test',
        password: 'password',
      })

      expect(resp.status).toBe(200)
      expect(resp.body.token).toBeDefined()
    })
    it('should return 400 for a missing username', async () => {
      const resp = await testApp.post('/api/createUser').send({
        password: 'password',
      })

      expect(resp.status).toBe(400)
    })
    it('should return 400 for a missing password', async () => {
      const resp = await testApp.post('/api/createUser').send({
        username: 'test',
      })

      expect(resp.status).toBe(400)
    })
    it('should be able to login with the created user', async () => {
      await testApp.post('/api/createUser').send({
        username: 'test',
        password: 'password',
      })

      const resp = await testApp.post('/api/login').send({
        username: 'test',
        password: 'password',
      })

      expect(resp.status).toBe(200)
      expect(resp.body.token).toBeDefined()
    })
    it('should be able to check login with the created user', async () => {
      const resp = await testApp.post('/api/createUser').send({
        username: 'test',
        password: 'password',
      })

      const token = resp.body.token

      const checkLoginResp = await testApp.get('/api/checkLogin').set('Authorization', `Bearer ${token}`)

      expect(checkLoginResp.status).toBe(200)
      expect(checkLoginResp.body.username).toBe('test')
    })
  })
})
