import { describe, it, expect, beforeEach } from 'vitest'
import { User } from '@prisma/client'
import { createUser } from '../../userService'
import { v4 } from 'uuid'
import { createPurchase } from '../createPurchase'
import { Category } from '../../../utils/selectableCategories'
import { getBudgetById } from '../../budgetService/getBudgetById'
import { createUserIncome } from '../../userIncomeService'
import { createBudget } from '../../budgetService'

describe('Create purchase', () => {
  let user: User | undefined

  beforeEach(async () => {
    user = await createUser(v4(), 'password')
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
  })
  it('should create a purchase and a budget if none exists', async () => {
    const purchase = await createPurchase({ userId: user!.id, amount: 100, description: 'Test purchase', category: Category.FOOD })
    expect(purchase.amount).toBe(100)
    expect(purchase.description).toBe('Test purchase')
    expect(purchase.category).toBe(Category.FOOD)
    expect(purchase.budgetId).toBeDefined()

    const budget = await getBudgetById(purchase.budgetId)
    expect(budget).toBeDefined()
    expect(budget.purchases).toContainEqual(purchase)
  })

  it('should create a purchase and a add it to a budget', async () => {
    const budget = await createBudget(user!.id, { year: 2024, month: 0 })
    const purchase = await createPurchase({ userId: user!.id, amount: 100, description: 'Test purchase', category: Category.FOOD, toBudget: { year: 2024, month: 0 } })
    const budgetAfter = await getBudgetById(budget.id)
    expect(budgetAfter.purchases).toContainEqual(purchase)
  })
})
