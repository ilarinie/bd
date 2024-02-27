import request from 'supertest'
import { app } from '../../app'
import { beforeAll, describe, expect, it } from 'vitest'
import { createUser } from '../../services/userService'
import { generateJwtToken } from '../../utils/generateJwtToken'
import { User } from '@prisma/client'
import { createUserIncome } from '../../services/userIncomeService'
import { v4 } from 'uuid'
import { createBudget } from '../../services/budgetService'

const testApp = request(app)

const TEST_PASSWORD = 'password'

describe('Budget router', () => {
  describe('without AUTH', () => {
    describe('GET /budget', () => {
      it('should return 401 for missing token', async () => {
        const resp = await testApp.get('/api/budget')
        expect(resp.status).toBe(401)
      })
    })
  })

  describe('GET /budget', () => {
    let user: User | undefined

    beforeAll(async () => {
      user = await createUser(v4(), TEST_PASSWORD)
      await createUserIncome(user.id, { year: 2024, month: 0 }, 1000)
    })

    it('should return budget', async () => {
      const resp = await testApp.get('/api/budget').set('Authorization', `Bearer ${generateJwtToken(user!)}`)
      expect(resp.status).toBe(200)
    })

    it('should find budget with query', async () => {
      const budget = await createBudget(user!.id, { year: 2024, month: 0 })
      const resp = await testApp.get('/api/budget?year=2024&month=0').set('Authorization', `Bearer ${generateJwtToken(user!)}`)
      expect(resp.status).toBe(200)
      expect(resp.body.budget.id).toBe(budget.id)
    })
    it('should return status 400 with invalid query', async () => {
      await createBudget(user!.id, { year: 2024, month: 0 })
      const resp = await testApp.get('/api/budget?year=totallyINvalid&month=0').set('Authorization', `Bearer ${generateJwtToken(user!)}`)
      expect(resp.status).toBe(400)
    })
  })
})
