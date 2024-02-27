import { beforeEach, describe, expect, it } from 'vitest'
import { createUser } from '../'
import { checkLogin } from '../'
import { v4 } from 'uuid'

const TEST_PASSWORD = 'password'

describe('Check login', () => {
  let user: {
    id: string
    username: string
    hashed_password: string
  }

  beforeEach(async () => {
    user = await createUser(v4(), TEST_PASSWORD)
  })

  it('should return true for a valid login', async () => {
    const result = await checkLogin(user.username, TEST_PASSWORD)
    expect(result).toBeDefined()
    expect(result?.username).toBe(user.username)
  })

  it('should return false for a invalid login', async () => {
    const result = await checkLogin(user.username, 'invalid_password')
    expect(result).toBe(undefined)
  })

  it('should return false for nonexistent user', async () => {
    const result = await checkLogin('fake name', TEST_PASSWORD)
    expect(result).toBe(undefined)
  })
})
