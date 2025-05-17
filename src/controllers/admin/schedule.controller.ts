import ScheduleModel from '../../models/admin/schedule.model'
import LectureModel from '../../models/admin/lecture.model'

import dayjs from 'dayjs'
import type { schedule, lecture } from './types'

class ScheduleController {
  async createSchedule ({ date, section_name, section_id }: schedule) {
    try {
      return await ScheduleModel.create({
        date,
        section_id,
        section_name
      })
    } catch (error) {
      throw error
    }
  }

  async createLectures (lectures: lecture[]) {
    try {
      return await LectureModel.bulkCreate(lectures)
    } catch (error) {
      throw error
    }
  }

  async deleteSchedule (id: number) {
    try {
      const schedule = await this.getScheduleById(id)

      if (!schedule) return

      await schedule.destroy()
    } catch (error) {
      throw error
    }
  }

  async deleteLecture (id: number) {
    try {
      const lecture = await LectureModel.findOne({
        where: {
          lecture_id: id
        }
      })

      if (!lecture) return

      await lecture.destroy()
    } catch (error) {
      throw error
    }
  }

  async getScheduleById (id: number) {
    try {
      return await ScheduleModel.findOne({
        where: {
          schedule_id: id
        },
        include: [
          { model: LectureModel }
        ]
      })
    } catch (error) {
      throw error
    }
  }

  async getScheduleBySectionId (id: number) {
    try {
      return await ScheduleModel.findAll({
        where: {
          section_id: id
        },
        include: [{ model: LectureModel }]
      })
    } catch (error) {
      throw error
    }
  }

  async getSchedules () {
    return await ScheduleModel.findAll({
      include: [
        { model: LectureModel }
      ]
    })
  }

  async updateSchedule ({ schedule_id, date, section_name, section_id }: schedule, lectures: lecture[]) {
    try {
      const schedule_date = dayjs.tz(date as Date, 'YYYY-MM-DD HH:mm:ss', 'Europe/Moscow')

      await ScheduleModel.update({
        date,
        section_name,
        section_id
      }, {
        returning: true,
        where: {
          schedule_id
        }
      })

      await Promise.all(lectures.map((lecture: lecture) => {
        if (lecture.hasOwnProperty('lecture_id')) {
          LectureModel.update({
            name: lecture.name,
            city: lecture.city,
            company: lecture.company,
            start: dayjs(lecture.start)
              .set('year', schedule_date.year())
              .set('month', schedule_date.month())
              .set('date', schedule_date.date())
              .valueOf(),
            end: dayjs(lecture.end)
              .set('year', schedule_date.year())
              .set('month', schedule_date.month())
              .set('date', schedule_date.date())
              .valueOf(),
            fio: lecture.fio,
            is_votable: lecture.is_votable
          }, {
            returning: true,
            where: {
              lecture_id: lecture.lecture_id
            }
          })
        } else {
          LectureModel.create({
            ...lecture,
            schedule_id
          })
        }
      }))
    } catch (error) {
      throw error
    }
  }
}

export default ScheduleController
