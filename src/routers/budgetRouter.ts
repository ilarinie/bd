import express from 'express'
import { jwtTokenAuth } from '../middlewares/jwtTokenAuth'
import { findBudget, getOrCreateBudget } from '../services/budgetService'
import { getBudgetStatistics } from '../services/budgetService/getBudgetStatistics'
import { MonthlyBudget } from '@prisma/client'
import { BudgetFindSchema } from '../types/BudgetTimeArgs'

export const budgetRouter = express.Router()

budgetRouter.use(jwtTokenAuth)

budgetRouter.get('/api/budget', async (req, res) => {
  const { month, year } = req.query
  let budget: MonthlyBudget | undefined
  const user = req.user

  if (month && year) {
    try {
      const { year, month } = BudgetFindSchema.parse(req.query)
      budget = await findBudget(req.user.id, {
        month,
        year,
      })
    } catch (err) {
      res.status(400).send({ message: 'Invalid query' })
      return
    }
  } else {
    budget = await getOrCreateBudget(user.id)
  }

  const budgetStatistics = await getBudgetStatistics(budget.id)
  res.send({
    budget,
    budgetStatistics,
  })
})
