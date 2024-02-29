import { User } from '@prisma/client'
import { v4 } from 'uuid'
import { describe, it, expect, beforeEach } from 'vitest'
import { createUser } from '../../userService'
import { createStaticExpense } from '../createStaticExpense'
import { Category } from '../../../utils/selectableCategories'
import { deactivateStaticExpense } from '../deactivateStaticExpense'
import { getStaticExpenses } from '../getStaticExpenses'

describe('Get static expenses', () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await createUser(v4(), 'foo', 1000)
    await createStaticExpense(user!.id, 'Test static expense', 100, Category.ALCOHOL)
    const staticExpense = await createStaticExpense(user!.id, 'Test static expense', 100, Category.ALCOHOL)
    await deactivateStaticExpense(user!.id, staticExpense.id)
  })
  it('should return active expenses by default', async () => {
    const expenses = await getStaticExpenses(user!.id)
    expect(expenses.length).toBe(1)
  })

  it('should return all static expenses if given parameter', async () => {
    const expenses = await getStaticExpenses(user!.id, false)
    expect(expenses.length).toBe(2)
  })
})
