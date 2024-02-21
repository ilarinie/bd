import { beforeEach, describe, expect, it } from 'vitest'
import { createUser } from '../createUser'
import { clearDB } from '../../../utils/clearDB'
import { checkLogin } from '../checkLogin'

const TEST_PASSWORD = 'password'

describe('Check login', () => {
  let user: {
    id: string
    username: string
    hashed_password: string
  }

  beforeEach(async () => {
    await clearDB()
    user = await createUser('test', TEST_PASSWORD)
  })

  it('should return true for a valid login', async () => {
    const result = await checkLogin(user.username, TEST_PASSWORD)
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
