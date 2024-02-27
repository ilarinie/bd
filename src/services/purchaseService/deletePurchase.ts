import { prismaClient } from '../../db'

export const deletePurchase = async (purchaseId: string) => {
  return await prismaClient.purchase.delete({
    where: {
      id: purchaseId,
    },
  })
}
