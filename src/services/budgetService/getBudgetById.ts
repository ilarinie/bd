import { prismaClient } from '../../db'

export const getBudgetById = async (budgetId: string) => {
  return await prismaClient.monthlyBudget.findFirstOrThrow({
    where: {
      id: budgetId,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}
