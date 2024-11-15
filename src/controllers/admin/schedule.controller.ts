import ScheduleModel from '../../models/admin/schedule.model'
import LectureModel from '../../models/admin/lecture.model'
import type { schedule, lecture } from './types'

class ScheduleController {
  async createSchedule (date: schedule) {
    try {
      return await ScheduleModel.create({ date: date })
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

  async getSchedules () {
    return await ScheduleModel.findAll({
      include: [
        { model: LectureModel }
      ]
    })
  }

  async updateSchedule (id: number, date: schedule, lectures: lecture[]) {
    try {
      await ScheduleModel.update({
        date
      }, {
        returning: true,
        where: {
          schedule_id: id
        }
      })

      await Promise.all(lectures.map((lecture: lecture) => {
        if (lecture.hasOwnProperty('lecture_id')) {
          LectureModel.update({
            name: lecture.name,
            city: lecture.city,
            company: lecture.company,
            start: lecture.start,
            end: lecture.end,
            fio: lecture.fio,
            section_name: lecture.section_name,
            section_id: lecture.section_id
          }, {
            returning: true,
            where: {
              lecture_id: lecture.lecture_id
            }
          })
        } else {
          LectureModel.create({
            ...lecture,
            schedule_id: id
          })
        }
      }))
    } catch (error) {
      throw error
    }
  }
}

export default ScheduleController
