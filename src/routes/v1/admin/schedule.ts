import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
// import type { schedule, lecture } from '../../../controllers/admin/types'
// import ScheduleController from '../../../controllers/admin/schedule.controller'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/schedule`
// const schedule_instance = new ScheduleController()

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  const { date, lectures } = req.body

  console.debug(date, lectures)

  res.json({
    success: true
  })
})

export default router
