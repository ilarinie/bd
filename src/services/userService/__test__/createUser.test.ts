import { describe, expect, it } from 'vitest'
import { createUser } from '../'
import { v4 } from 'uuid'

describe('Create user', () => {
  it('should create a user', async () => {
    const userName = v4()
    const user = await createUser(userName, 'password', 1000)
    expect(user.username).toBe(userName)
    expect(user.hashed_password).not.toBe('password')
  })

  it('should not create a user without a username', async () => {
    await expect(createUser('', 'password', 1000)).rejects.toThrow('Username and password are required')
  })

  it('should not create a user without a password', async () => {
    await expect(createUser(v4(), '', 1000)).rejects.toThrow('Username and password are required')
  })
})
