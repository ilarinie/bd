import { prismaClient } from '../../db'

export const getUser = async (id: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }
  return user
}
