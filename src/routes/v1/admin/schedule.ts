import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import type { lecture } from '../../../controllers/admin/types'
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
  try {
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
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.get(`/api/${ROUTES_VERSION}/schedule-by-section`, async (req: any, res: any) => {
  try {
    const { id } = req.query

    if (!id) {
      res.json({
        success: false,
        message: 'Property id is required.'
      })

      return
    }

    const schedule = await schedule_instance.getScheduleBySectionId(id)

    res.json({
      success: true,
      schedule
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { date, section_name, section_id, lectures } = req.body

    const { schedule_id = 0 } = (await schedule_instance.createSchedule({
      date,
      section_id,
      section_name
    }))?.dataValues || {}
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
    const { schedule_id, date, section_name, section_id, lectures } = req.body
    await schedule_instance.updateSchedule({ schedule_id, date, section_name, section_id }, lectures)

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
  try {
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
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

router.delete(`/api/${ROUTES_VERSION}/lecture`, async (req: any, res: any) => {
  try {
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
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

export default router
