import { timingSafeEqual } from 'crypto'
import { prismaClient } from '../../db'
import { scryptAsync } from './scryptAsync'
import { type User } from '@prisma/client'

export const checkLogin = async (username: string, password: string): Promise<User | undefined> => {
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return undefined
  }

  if (!(await comparePassword(password, user.hashed_password))) {
    return undefined
  }

  return user
}

const comparePassword = async (password: string, storedPassword: string): Promise<boolean> => {
  // split() returns array
  const [hashedPassword, salt] = storedPassword.split('.')
  // we need to pass buffer values to timingSafeEqual
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
  // we hash the new sign-in password
  const suppliedPasswordBuf = (await scryptAsync(password, salt, 64)) as Buffer
  // compare the new supplied password with the stored hashed password
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}
