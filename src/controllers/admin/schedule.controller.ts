import ScheduleModel from '../../models/admin/schedule.model'
import LectureModel from '../../models/admin/lecture.model'
import type { schedule, lecture } from './types'

class ScheduleController {
  async createSchedule (date: schedule) {
    try {
      return await ScheduleModel.create({
        date
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
}

export default ScheduleController
