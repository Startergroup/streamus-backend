import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Excel from 'exceljs'
import ScheduleController from '../../../controllers/admin/schedule.controller'
import type { lecture } from '../../../controllers/admin/types'
import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'

dayjs.extend(utc)
dayjs.extend(timezone)

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

router.post(`/api/${ROUTES_VERSION}/schedule/import`, async (_req: any, res: any) => {
  try {
    // const { path } = req.body
    const workbook = new Excel.Workbook()

    await workbook.xlsx.readFile('C:\\Users\\MrTad\\Desktop\\Startergroup\\Streamus apps\\backend\\public\\Шаблон_расписания.xlsx')

    const worksheet = workbook.worksheets[0]
    const schedules: any[] = []

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return

      // @ts-ignore
      schedules.push(row.values.slice(1))
    })

    const { schedule_id = 0 } = (await schedule_instance.createSchedule({
      date: dayjs(schedules[0][0]).tz('Europe/Moscow').valueOf(),
      section_id: schedules[0][1],
      section_name: schedules[0][2]
    }))?.dataValues || {}
    const mapped_lectures = schedules.map(schedule => {
      const schedule_date = dayjs(schedule[0])
      const schedule_date_year = schedule_date.get('year')
      const schedule_date_month = schedule_date.get('month')
      const schedule_date_date = schedule_date.get('date')

      const start_date = dayjs(schedule[5])
        .set('year', schedule_date_year)
        .set('month', schedule_date_month)
        .set('date', schedule_date_date)
      const end_date = dayjs(schedule[6])
        .set('year', schedule_date_year)
        .set('month', schedule_date_month)
        .set('date', schedule_date_date)

      return {
        city: schedule[3],
        company: schedule[4],
        end: dayjs(end_date).tz('Europe/Moscow').valueOf(),
        fio: schedule[7],
        is_votable: schedule[9].toLowerCase() === 'да',
        name: schedule[8],
        start: dayjs(start_date).tz('Europe/Moscow').valueOf(),
        schedule_id
      }
    })

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
