import { User } from '@prisma/client'
import { v4 } from 'uuid'
import { describe, it, expect, beforeEach } from 'vitest'
import { createUser } from '../../userService'
import { createUserIncome } from '../../userIncomeService'
import { createBudget } from '../createBudget'
import { createStaticExpense } from '../../staticExpenseService'
import { Category } from '../../../utils/selectableCategories'

describe('Create budget', () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await createUser(v4(), 'foo')
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
  })

  it('should create a budget empty budget with no static expenses', async () => {
    const budget = await createBudget(user!.id, { year: 2024, month: 0 })
    expect(budget.budget).toBe(1000)
    expect(budget.purchases).toEqual([])
  })
  it('should throw if no user income exists', async () => {
    await expect(createBudget(user!.id, { year: 2023, month: 1 })).rejects.toThrow('User income not found')
  })
  it('should throw if user does not exists', async () => {
    await expect(createBudget('fooo', { year: 2024, month: 0 })).rejects.toThrow('User not found')
  })
  it('should add static expenses as purchases', async () => {
    await createStaticExpense(user!.id, 'Test static expense', 100, Category.FOOD)
    const budget = await createBudget(user!.id, { year: 2024, month: 0 })
    expect(budget.purchases.length).toBe(1)
  })
})
