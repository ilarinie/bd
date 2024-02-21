import { beforeEach, describe, expect, it } from 'vitest'
import { createUser } from '../createUser'
import { clearDB } from '../../../utils/clearDB'

describe('Create user', () => {
  beforeEach(async () => {
    await clearDB()
  })

  it('should create a user', async () => {
    const user = await createUser('test', 'password')
    expect(user.username).toBe('test')
    expect(user.hashed_password).not.toBe('password')
  })

  it('should not create a user without a username', async () => {
    await expect(createUser('', 'password')).rejects.toThrow('Username and password are required')
  })

  it('should not create a user without a password', async () => {
    await expect(createUser('test', '')).rejects.toThrow('Username and password are required')
  })
})
