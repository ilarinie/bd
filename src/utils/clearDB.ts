import { prismaClient } from '../db'

export const clearDB = async () => {
  await prismaClient.purchase.deleteMany()
  await prismaClient.monthlyBudget.deleteMany()
  await prismaClient.staticExpense.deleteMany()
  await prismaClient.userIncome.deleteMany()
  await prismaClient.user.deleteMany()
}
