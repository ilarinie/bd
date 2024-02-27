import { coerce, object } from 'zod'

export type BudgetTimeArgs = {
  /**
   * 0 - 11
   */
  month: number
  year: number
}

export const BudgetFindSchema = object({
  month: coerce.number(),
  year: coerce.number(),
})
