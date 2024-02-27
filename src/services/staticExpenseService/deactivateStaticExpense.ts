import { prismaClient } from '../../db'
import logger from '../../logger'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'
import { getOrCreateBudget } from '../budgetService'
import { deletePurchase } from '../purchaseService/deletePurchase'

export const deactivateStaticExpense = async (userId: string, staticExpenseId: string, removeFromBudget?: BudgetTimeArgs) => {
  const staticExpense = await prismaClient.staticExpense.findUnique({
    where: {
      id: staticExpenseId,
      userId,
    },
  })
  if (!staticExpense) {
    throw new Error('Static expense not found')
  }

  const updateStaticExpense = await prismaClient.staticExpense.update({
    where: {
      id: staticExpenseId,
    },
    data: {
      isActive: false,
    },
  })

  if (removeFromBudget) {
    const budget = await getOrCreateBudget(userId, removeFromBudget)
    const purchaseId = budget.purchases.find(p => p.staticExpenseId === staticExpenseId)?.id
    if (!purchaseId) {
      logger.error('No purchase found when trying to remove static expense from budget')
    } else {
      await deletePurchase(purchaseId)
    }
  }

  return updateStaticExpense
}
