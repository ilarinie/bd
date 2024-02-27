import { prismaClient } from '../../db'

export const getAllUserIncomes = async (userId: string) => {
  const incomes = await prismaClient.userIncome.findMany({
    where: {
      userId,
    },
    orderBy: {
      startYear: 'desc',
    },
  })

  return incomes.sort((a, b) => {
    if (a.startYear === b.startYear) {
      return b.startMonth - a.startMonth
    }

    return b.startYear - a.startYear
  })
}
