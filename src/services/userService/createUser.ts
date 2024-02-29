import { randomBytes } from 'crypto'
import { prismaClient } from '../../db'
import { scryptAsync } from './scryptAsync'
import { createUserIncome } from '../userIncomeService'

export const createUser = async (username: string, password: string, initialIncome: number) => {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }
  const salt = randomBytes(16).toString('hex')
  const hashedPassword = (await scryptAsync(password, salt, 64)) as Buffer
  const userData = {
    username,
    hashed_password: `${hashedPassword.toString('hex')}.${salt}`,
  }

  const user = await prismaClient.user.create({
    data: userData,
  })

  /**
   * Also create an initial income for the user
   */
  await createUserIncome(user.id, { month: 0, year: 1900 }, initialIncome)

  return user
}
