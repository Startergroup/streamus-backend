import Excel from 'exceljs'
import ScheduleController from '@/controllers/admin/schedule.controller'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { lecture } from '@/controllers/admin/types'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/Moscow')

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/schedule`

router.get(`/api/${ROUTES_VERSION}/schedules`, async (_req: any, res: any) => {
  try {
    const schedules = await ScheduleController.getSchedules()

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

    const schedule = await ScheduleController.getScheduleById(id)

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

    const schedule = await ScheduleController.getScheduleBySectionId(id)

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

    const { schedule_id = 0 } = (await ScheduleController.createSchedule({
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

    await ScheduleController.createLectures(mapped_lectures)

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

router.post(`/api/${ROUTES_VERSION}/schedule/import`, async (req: any, res: any) => {
  try {
    const { path } = req.body
    const targetPath = process.env.NODE_ENV === 'production' ? path : 'C:\\Users\\MrTad\\Desktop\\backend\\public\\Шаблон_расписания.xlsx'
    const workbook = new Excel.Workbook()

    await workbook.xlsx.readFile(targetPath)

    const worksheet = workbook.worksheets[0]
    const grouped_data:{ [key:string]: unknown } = {}
    const result = []

    worksheet.eachRow(async (row, index) => {
      if (index <= 1) return

      const [
        date,
        section_id,
        section_name,
        city,
        company,
        start_time,
        end_time,
        fio,
        lecture_name,
        is_votable
      ] = (row.values as []).slice(1)
      const schedule_date = dayjs.tz(date, 'YYYY-MM-DD HH:mm:ss', 'Europe/Moscow')
      const group_key = `${schedule_date}_${section_id}`

      if (!grouped_data[group_key]) {
        grouped_data[group_key] = {
          date: schedule_date.valueOf(),
          section_id: Number(section_id),
          section_name,
          lectures: []
        }
      }

      // Создаем полные даты для начала и окончания события
      const start_date_time = schedule_date
        // @ts-ignore
        .hour(start_time.split(':')[0])
        // @ts-ignore
        .minute(start_time.split(':')[1])
        .second(0);

      const end_date_time = schedule_date
        // @ts-ignore
        .hour(end_time.split(':')[0])
        // @ts-ignore
        .minute(end_time.split(':')[1])
        .second(0);

      // Добавляем ВСЕ события, включая перерывы и регистрацию
      // @ts-ignore
      grouped_data[group_key].lectures.push({
        city: city || '',
        company: company || '',
        end: end_date_time.valueOf(),
        start: start_date_time.valueOf(),
        fio: fio || '',
        is_votable: (is_votable as string).toLowerCase() === 'да',
        name: lecture_name || ''
      })
    })

    for (const key in grouped_data) {
      // @ts-ignore
      grouped_data[key].lectures.sort((a: any, b: any) => a.start - b.start)
      result.push(grouped_data[key])
    }

    for (let i = 0; i < result.length; i++) {
      // @ts-ignore
      const { date, section_id, section_name, lectures } = result[i]
      const { schedule_id } = await ScheduleController.createSchedule({
        date,
        section_id,
        section_name
      })
      const mapped_lectures = lectures.map((item: any) => ({ ...item, schedule_id }))

      await ScheduleController.createLectures(mapped_lectures)
    }

    res.json({
      success: true
    })
  } catch (error) {
    console.debug('Error:', error)

    res.json({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { schedule_id, date, section_name, section_id, lectures } = req.body
    await ScheduleController.updateSchedule({ schedule_id, date, section_name, section_id }, lectures)

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

    await ScheduleController.deleteSchedule(id)
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

    await ScheduleController.deleteLecture(id)
    res.json({ success: true })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

export default router
