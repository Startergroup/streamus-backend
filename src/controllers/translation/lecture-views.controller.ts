import LectureViewsModel from '@/models/admin/schedule/lecture-views.model'

class LectureViewsController {
  public async recordView ({ lecture_id, user_id, timestamp }: { lecture_id: number, user_id: number, timestamp: Date }) {
    try {
      const record = await LectureViewsModel.findAll({
        where: {
          user_id,
          lecture_id
        }
      })

      if (record.length) {
        await LectureViewsModel.update({
          end: timestamp
        }, {
          where: {
            user_id,
            lecture_id
          }
        })
      } else {
        await LectureViewsModel.create({
          lecture_id,
          user_id,
          start: timestamp,
          end: timestamp
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export default new LectureViewsController()
