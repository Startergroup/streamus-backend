import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import type { schedule, lecture } from '../../../controllers/admin/types'
import ScheduleController from '../../../controllers/admin/schedule.controller'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/schedule`
const schedule_instance = new ScheduleController()

router.get(`/api/${ROUTES_VERSION}/schedules`, async (_req: any, res: any) => {
  try {
    const schedules = await schedule_instance.getSchedules()

    res.json({
      success: true,
      schedules
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  const { id } = req.query

  if (!id) {
    res.json({
      success: false,
      message: 'Property id is required.'
    })

    return
  }

  const schedule = await schedule_instance.getScheduleById(id)

  res.json({
    success: true,
    schedule
  })
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { date, lectures }: { date: schedule, lectures: lecture[] } = req.body

    const { schedule_id = 0 } = (await schedule_instance.createSchedule(date))?.dataValues || {}
    const mapped_lectures = lectures.map(
      (item: lecture) => ({
        ...item,
        schedule_id
      })
    )

    await schedule_instance.createLectures(mapped_lectures)

    res.json({
      success: true
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { schedule_id, date, lectures }: { schedule_id: number, date: schedule, lectures: lecture[] } = req.body
    await schedule_instance.updateSchedule(schedule_id, date, lectures)

    res.json({
      success: true
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { id } = req.body

  if (!id) {
    res.json({
      success: false,
      message: 'Property id is required.'
    })

    return
  }

  await schedule_instance.deleteSchedule(id)
  res.json({ success: true })
})

router.delete(`/api/${ROUTES_VERSION}/lecture`, async (req: any, res: any) => {
  const { id } = req.body

  if (!id) {
    res.json({
      success: false,
      message: 'Property id is required.'
    })

    return
  }

  await schedule_instance.deleteLecture(id)
  res.json({ success: true })
})

export default router
