import { User } from '@prisma/client'
import { v4 } from 'uuid'
import { describe, it, expect, beforeEach } from 'vitest'
import { createUser } from '../../userService'
import { createStaticExpense } from '../createStaticExpense'
import { Category } from '../../../utils/selectableCategories'
import { prismaClient } from '../../../db'
import { createUserIncome } from '../../userIncomeService'

describe('Create static expense', () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await createUser(v4(), 'password')
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
  })

  it.only('should create a static expense', async () => {
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.FOOD)
    expect(staticExpense.amount).toBe(100)
    expect(staticExpense.description).toBe('Test static expense')
    expect(staticExpense.category).toBe(Category.FOOD)

    const budget = await prismaClient.monthlyBudget.findFirst({
      where: {
        userId: user!.id,
      },
    })

    expect(budget).toBeNull()
  })

  it.only('should create a static expense and add it to budget', async () => {
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.FOOD, { year: 2024, month: 0 })
    expect(staticExpense.amount).toBe(100)
    expect(staticExpense.description).toBe('Test static expense')
    expect(staticExpense.category).toBe(Category.FOOD)

    // const budget = await getOrCreateBudget(user!.id)

    // expect(budget).toBeDefined()
    // expect(budget.purchases.length).toBe(1)
  })
})