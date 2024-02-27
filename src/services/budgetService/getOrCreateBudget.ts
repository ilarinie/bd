import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'
import { createBudget } from './createBudget'

export const getOrCreateBudget = async (userId: string, timeArgs?: BudgetTimeArgs) => {
  const date = new Date()

  let year = date.getFullYear()
  let month = date.getMonth()

  if (timeArgs) {
    year = timeArgs.year
    month = timeArgs.month
  }

  const budget = await prismaClient.monthlyBudget.findFirst({
    where: {
      userId,
      year,
      month,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (budget) {
    return budget
  }

  return createBudget(userId, { year, month })
}
