import { prismaClient } from '../db'

export const clearDB = async () => {
  await prismaClient.user.deleteMany()
}
