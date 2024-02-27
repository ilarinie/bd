import { describe, it, expect } from 'vitest'
import { createUser } from '../../services/userService'
import { v4 } from 'uuid'
import { createUserIncome } from '../../services/userIncomeService'
import { createBudget } from '../../services/budgetService'
import { createStaticExpense } from '../../services/staticExpenseService'
import { Category } from '../selectableCategories'
import { clearDB } from '../clearDB'
import { prismaClient } from '../../db'

describe('ClearDB', () => {
  it('should remove all data from the database', async () => {
    const user = await createUser(v4(), 'password')
    expect(user).toBeDefined()
    const income = await createUserIncome(user.id, { year: 2024, month: 0 }, 1000)
    expect(income).toBeDefined()
    const staticExpense = await createStaticExpense(user.id, 'Test static expense', 100, Category.FOOD, { year: 2024, month: 0 })
    expect(staticExpense).toBeDefined()
    const budget = await createBudget(user.id, { year: 2024, month: 0 })
    expect(budget).toBeDefined()
    const purchase = await createBudget(user.id, { year: 2024, month: 0 })
    expect(purchase).toBeDefined()

    await clearDB()

    const users = await prismaClient.user.findMany()
    expect(users).toHaveLength(0)
    const incomes = await prismaClient.userIncome.findMany()
    expect(incomes).toHaveLength(0)
    const staticExpenses = await prismaClient.staticExpense.findMany()
    expect(staticExpenses).toHaveLength(0)
    const budgets = await prismaClient.monthlyBudget.findMany()
    expect(budgets).toHaveLength(0)
    const purchases = await prismaClient.purchase.findMany()
    expect(purchases).toHaveLength(0)
  })
})
