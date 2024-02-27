import { User, UserIncome } from '@prisma/client'
import { prismaClient } from '../../db'
import { BudgetTimeArgs } from '../../types/BudgetTimeArgs'
import { getStaticExpenses } from '../staticExpenseService'
import { getUserIncome } from '../userIncomeService'
import { getUser } from '../userService'

export const createBudget = async (userId: string, timeArgs: BudgetTimeArgs) => {
  let user: User | undefined

  try {
    user = await getUser(userId)
  } catch (e) {
    throw new Error('User not found')
  }

  const staticExpenses = await getStaticExpenses(userId)

  let userIncome: UserIncome | undefined
  try {
    userIncome = await getUserIncome(userId, timeArgs)
  } catch (e) {
    throw new Error('User income not found')
  }

  const newBudget = await prismaClient.monthlyBudget.create({
    data: {
      year: timeArgs.year,
      month: timeArgs.month,
      budget: userIncome.amount,
      purchases: {
        create: staticExpenses.map(staticExpense => ({
          description: staticExpense.description,
          amount: staticExpense.amount,
          category: staticExpense.category,
        })),
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  return await prismaClient.monthlyBudget.findFirstOrThrow({
    where: {
      id: newBudget.id,
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
