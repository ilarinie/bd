import { randomBytes } from 'crypto'
import { prismaClient } from '../../db'
import { scryptAsync } from './scryptAsync'

export const createUser = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }
  const salt = randomBytes(16).toString('hex')
  const hashedPassword = (await scryptAsync(password, salt, 64)) as Buffer
  const user = {
    username,
    hashed_password: `${hashedPassword.toString('hex')}.${salt}`,
  }

  return await prismaClient.user.create({
    data: user,
  })
}
