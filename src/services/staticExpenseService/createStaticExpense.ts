import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'
import { Category } from '../../utils/selectableCategories'
import { getOrCreateBudget } from '../budgetService'
import { createPurchase } from '../purchaseService'

export const createStaticExpense = async (userId: string, description: string, amount: number, category: Category, toBudget?: BudgetTimeArgs) => {
  if (toBudget) {
    await getOrCreateBudget(userId, toBudget)
  }

  const staticExpense = await prismaClient.staticExpense.create({
    data: {
      description,
      amount,
      category,
      isActive: true,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })

  if (toBudget) {
    await createPurchase({ userId, amount, description, category: Category.STATIC_EXPENSES, staticExpenseId: staticExpense.id, toBudget })
  }

  return staticExpense
}
