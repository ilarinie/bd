import { UserIncome } from '@prisma/client'
import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'

export const getUserIncome = async (userId: string, budgetTimeArgs: BudgetTimeArgs) => {
  const whereArgs = {
    AND: [
      {
        userId,
      },
      {
        startMonth: {
          lte: budgetTimeArgs.month,
        },
      },
      {
        startYear: {
          lte: budgetTimeArgs.year,
        },
      },
      {
        OR: [
          {
            endMonth: {
              gte: budgetTimeArgs.month,
            },
            endYear: {
              gte: budgetTimeArgs.year,
            },
          },
          {
            endMonth: null,
            endYear: null,
          },
        ],
      },
    ],
  }

  const userIncome = await prismaClient.userIncome.findMany({
    where: whereArgs,
  })

  const endTimedIncome = userIncome.filter(income => income.endMonth !== null)

  let incomeToReturn: UserIncome | undefined
  if (endTimedIncome.length > 0) {
    incomeToReturn = endTimedIncome[0]
  } else {
    incomeToReturn = userIncome[0]
  }
  if (!incomeToReturn) {
    throw new Error('No income found for the given time')
  }
  return incomeToReturn
}
