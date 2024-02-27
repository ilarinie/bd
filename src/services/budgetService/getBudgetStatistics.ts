import { getBudgetById } from './getBudgetById'

export const getBudgetStatistics = async (budgetId: string) => {
  const currentDate = new Date()
  const budget = await getBudgetById(budgetId)

  const { purchases } = budget

  const totalSpent = purchases.reduce((acc, purchase) => acc + purchase.amount, 0)
  const totalRemaining = budget.budget - totalSpent

  const remainingDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() - currentDate.getDate()

  const dailyBudget = totalRemaining / remainingDaysInMonth

  return {
    totalSpent,
    totalRemaining,
    dailyBudget,
  }
}
