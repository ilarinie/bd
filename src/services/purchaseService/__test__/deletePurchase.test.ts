import { v4 } from 'uuid'
import { describe, it, expect } from 'vitest'
import { createUser } from '../../userService'
import { createPurchase } from '..'
import { Category } from '../../../utils/selectableCategories'
import { deletePurchase } from '../deletePurchase'
import { prismaClient } from '../../../db'
import { createUserIncome } from '../../userIncomeService'
import { createBudget } from '../../budgetService'

describe('Delete purchase', () => {
  it('should delete a purchase', async () => {
    const user = await createUser(v4(), 'foo')
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
    await createBudget(user!.id, { year: 2024, month: 0 })
    const purchase = await createPurchase({ userId: user!.id, description: 'Test purchase', amount: 100, category: Category.ALCOHOL, toBudget: { year: 2024, month: 0 } })
    await deletePurchase(purchase.id)
    const purchaseFromDb = await prismaClient.purchase.findFirst({
      where: {
        id: purchase.id,
      },
    })
    expect(purchaseFromDb).toBe(null)
  })
})
