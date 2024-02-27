import { v4 } from 'uuid'
import { User } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'
import { createUser } from '../../userService'
import { createUserIncome } from '../createUserIncome'
import { getUserIncome } from '../getUserIncome'

describe('getUserIncome', () => {
  let user: User | undefined

  beforeEach(async () => {
    user = await createUser(v4(), 'password')
  })

  it('should return user income', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
    const userIncome = await getUserIncome(user!.id, { year: 2024, month: 0 })
    expect(userIncome.userId).toBe(user!.id)
    expect(userIncome.amount).toBe(1000)
  })

  it('should return correct user income with time args', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 2000)
    await createUserIncome(user!.id, { year: 2024, month: 1 }, 1000)

    const userIncome = await getUserIncome(user!.id, { year: 2024, month: 1 })

    expect(userIncome.userId).toBe(user!.id)
    expect(userIncome.amount).toBe(1000)
  })

  it('should return correct user income with time args', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 2000)
    await createUserIncome(user!.id, { year: 2024, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2024, month: 2 }, 3000)

    const userIncome = await getUserIncome(user!.id, { year: 2024, month: 1 })

    expect(userIncome.userId).toBe(user!.id)
    expect(userIncome.amount).toBe(1000)
  })

  it('should return correct user income with time args', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 2000)
    await createUserIncome(user!.id, { year: 2024, month: 2 }, 3000)

    const userIncome = await getUserIncome(user!.id, { year: 2024, month: 1 })

    expect(userIncome.userId).toBe(user!.id)
    expect(userIncome.amount).toBe(2000)
  })
})
