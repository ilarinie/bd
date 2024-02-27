import { describe, it, expect, beforeEach } from 'vitest'
import { createUser } from '../../userService'
import { v4 } from 'uuid'
import { Category } from '../../../utils/selectableCategories'
import { createStaticExpense } from '..'
import { deactivateStaticExpense } from '../deactivateStaticExpense'
import { prismaClient } from '../../../db'
import { User } from '@prisma/client'
import { createUserIncome } from '../../userIncomeService'
import { getOrCreateBudget } from '../../budgetService'

describe('Deactivate static expense', () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await createUser(v4(), 'foo')
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
  })

  it('should deactivate a static expense', async () => {
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.ALCOHOL)
    expect(staticExpense.isActive).toBe(true)
    await deactivateStaticExpense(user!.id, staticExpense.id)

    const expenseFromDB = await prismaClient.staticExpense.findFirst({
      where: {
        id: staticExpense.id,
      },
    })

    expect(expenseFromDB?.isActive).toBe(false)
  })

  it('should throw an error if the expense does not exist', async () => {
    await expect(deactivateStaticExpense(user!.id, v4())).rejects.toThrow('Static expense not found')
  })

  it('should remove the expense from current budget if found', async () => {
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.ALCOHOL, { year: 2024, month: 0 })
    expect(staticExpense.isActive).toBe(true)
    await deactivateStaticExpense(user!.id, staticExpense.id, { year: 2024, month: 0 })
    const budget = await getOrCreateBudget(user!.id, { year: 2024, month: 0 })
    expect(budget.purchases.length).toBe(0)
  })

  it('should not throw if removing expense from a budget where it does not exists', async () => {
    await getOrCreateBudget(user!.id, { year: 2024, month: 0 })
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.ALCOHOL)
    expect(staticExpense.isActive).toBe(true)
    const budgetAfterStaticExpenseCreation = await getOrCreateBudget(user!.id, { year: 2024, month: 0 })
    expect(budgetAfterStaticExpenseCreation.purchases.length).toBe(0)
    await expect(deactivateStaticExpense(user!.id, staticExpense.id, { year: 2024, month: 0 })).resolves.not.toThrow()
    const budgetAfterStaticExpenseDeactivation = await getOrCreateBudget(user!.id, { year: 2024, month: 0 })
    expect(budgetAfterStaticExpenseDeactivation.purchases.length).toBe(0)
  })
})
