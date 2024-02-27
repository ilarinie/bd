import { prismaClient } from '../../db'

export const getStaticExpenses = async (userId: string, onlyActive = true) => {
  const staticExpenses = await prismaClient.staticExpense.findMany({
    where: {
      userId,
      isActive: onlyActive ? onlyActive : undefined,
    },
  })

  return staticExpenses
}
