import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'

export const findBudget = async (userId: string, query: BudgetTimeArgs) => {
  const budget = await prismaClient.monthlyBudget.findFirstOrThrow({
    where: {
      userId,
      month: query.month,
      year: query.year,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
  return budget
}
