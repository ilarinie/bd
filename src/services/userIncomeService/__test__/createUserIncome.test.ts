import { describe, it, expect, beforeEach } from 'vitest'
import { v4 } from 'uuid'
import { createUser } from '../../userService'
import { User } from '@prisma/client'
import { createUserIncome, getAllUserIncomes, getUserIncome } from '../'

describe('Create user income', () => {
  let user: User | undefined

  beforeEach(async () => {
    user = await createUser(v4(), 'password', 1000)
  })

  it('should create a user income when no income exists', async () => {
    const userIncome = await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
    expect(userIncome!.userId).toBe(user!.id)
    expect(userIncome!.amount).toBe(1000)
  })

  it('should remove future incomes if they exists', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
    const allIncomes = await getAllUserIncomes(user!.id)
    expect(allIncomes.length).toBe(2)
  })

  it('should add endtime to older income when creating a new one', async () => {
    await createUserIncome(user!.id, { year: 2024, month: 0 }, 1000)
    await createUserIncome(user!.id, { year: 2024, month: 1 }, 1000)
    const allIncomes = await getAllUserIncomes(user!.id)
    expect(allIncomes[1].endMonth).toBeDefined()
    expect(allIncomes[1].endMonth).toEqual(0)
    expect(allIncomes[1].endYear).toEqual(2024)
  })

  it('should not create multiple incomes with no end times', async () => {
    await createUserIncome(user!.id, { year: 1999, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2000, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2020, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2021, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2022, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2022, month: 3 }, 1000)
    await createUserIncome(user!.id, { year: 2024, month: 5 }, 1000)

    const allIncomes = await getAllUserIncomes(user!.id)
    expect(allIncomes.filter(income => income.endMonth === null).length).toBe(1)
    expect(allIncomes.filter(income => income.endYear === null).length).toBe(1)
  })

  it('should not be able to create incomes in the past, if there is a future ended income', async () => {
    await createUserIncome(user!.id, { year: 1999, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2000, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2020, month: 1 }, 1000)
    await expect(createUserIncome(user!.id, { year: 1997, month: 1 }, 1000)).rejects.toThrow(
      'Cannot create a new income starting in the past when there are future incomes already created',
    )
  })

  it('should end the last active income on the last month of previous year, if new income starts on the first month', async () => {
    await createUserIncome(user!.id, { year: 1999, month: 1 }, 1000)
    await createUserIncome(user!.id, { year: 2000, month: 0 }, 1000)

    const income = await getUserIncome(user!.id, { year: 1999, month: 2 })
    expect(income.endMonth).toBe(11)
    expect(income.endYear).toBe(1999)
  })
})
