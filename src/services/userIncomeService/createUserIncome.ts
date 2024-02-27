import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'

export const createUserIncome = async (userId: string, args: BudgetTimeArgs, incomeAmountAfterTaxes: number) => {
  const futureIncomes = await prismaClient.userIncome.findMany({
    where: {
      userId,
      AND: [
        {
          startMonth: {
            gte: args.month,
          },
          startYear: {
            gte: args.year,
          },
        },
      ],
    },
  })

  if (futureIncomes.length > 0) {
    if (futureIncomes.filter(income => income.endMonth !== null)[0]) {
      throw new Error('Cannot create a new income starting in the past when there are future incomes already created')
    }

    // Remove any future incomes that have the same start time
    await prismaClient.userIncome.deleteMany({
      where: {
        id: {
          in: futureIncomes.map(income => income.id),
        },
      },
    })
  }

  const existingUserIncome = await prismaClient.userIncome.findFirst({
    where: {
      AND: [
        { userId },

        {
          endMonth: null,
        },
        {
          endYear: null,
        },
      ],
    },
  })

  if (existingUserIncome) {
    await prismaClient.userIncome.update({
      where: {
        id: existingUserIncome.id,
      },
      data: {
        endMonth: args.month === 0 ? 11 : args.month - 1,
        endYear: args.month === 0 ? args.year - 1 : args.year,
      },
    })
  }

  const newUserIncome = await prismaClient.userIncome.create({
    data: {
      userId: userId,
      startMonth: args.month,
      startYear: args.year,
      amount: incomeAmountAfterTaxes,
    },
  })
  return newUserIncome
}
