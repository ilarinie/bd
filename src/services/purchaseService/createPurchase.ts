import { getOrCreateBudget } from '../budgetService'
import { prismaClient } from '../../db'
import { Category } from '../../utils/selectableCategories'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'

type PurchaseCreateArgs = {
  userId: string
  amount: number
  description: string
  category: Category
  toBudget?: BudgetTimeArgs
  staticExpenseId?: string
}

export const createPurchase = async ({ userId, amount, description, category, toBudget, staticExpenseId }: PurchaseCreateArgs) => {
  const budget = await getOrCreateBudget(userId, toBudget)

  const purchase = await prismaClient.purchase.create({
    data: {
      amount,
      description,
      category,
      budgetId: budget.id,
      staticExpenseId,
    },
  })

  return purchase
}
