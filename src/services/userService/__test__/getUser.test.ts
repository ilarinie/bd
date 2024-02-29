import { beforeEach, describe, expect, it } from 'vitest'
import { createUser, getUser } from '../'
import { v4 } from 'uuid'
import { User } from '@prisma/client'

describe('Get user', () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await createUser(v4(), 'password', 1000)
  })
  it('should get a user', async () => {
    const foundUser = await getUser(user!.id)
    expect(foundUser).toBeDefined()
    expect(foundUser!.username).toBe(user!.username)
  })

  it('should throw if no user is found', async () => {
    try {
      await getUser('fake id')
    } catch (err) {
      expect(err).toEqual(new Error('User not found'))
    }
  })
})
