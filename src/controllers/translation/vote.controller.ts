import LectureModel from '@/models/admin/lecture.model'
import LectureViewsModel from '@/models/admin/lecture-views.model'
import VoteModel from '@/models/translation/vote.model'
import dayjs from 'dayjs'
import sequelize from 'sequelize'
import type { vote } from './types'
import { Op } from 'sequelize'

class VoteController {
  public async getUserVotes (code_id: number) {
    try {
      return await VoteModel.findAll({
        where: {
          user_id: code_id
        }
      }) || []
    } catch (error) {
      throw error
    }
  }

  public async createVote ({ user_id, lecture_id, schedule_id }: vote) {
    try {
      if (!(user_id && lecture_id && schedule_id)) {
        new Error('Invalid code id or lecture_id')
        return
      }

      const vote = await VoteModel.findOne({
        where: {
          lecture_id,
          user_id,
          schedule_id
        }
      })

      await vote?.destroy()

      if (vote) {
        new Error('User already voted')
        return
      }

      return await VoteModel.create({
        user_id,
        lecture_id,
        schedule_id
      })
    } catch (error) {
      throw error
    }
  }

  public async getReportVote ({ start, end }: { start: Date, end: Date }) {
    try {
      const lectures = await LectureModel.findAll({
        where: {
          start: {
            [Op.between]: [start, end]
          },
          is_votable: true
        }
      })
      const sortedLectures = lectures.sort((a:LectureModel, b:LectureModel) => dayjs(a.start).unix() - dayjs(b.start).unix())

      return await Promise.all(sortedLectures.map(async lecture => {
        return {
          ...lecture.toJSON(),
          votes: await VoteModel.count({
            where: {
              lecture_id: lecture.lecture_id
            }
          })
        }
      }))
    } catch (error) {
      throw error
    }
  }

  public async getReportBySection (id: number) {
    try {
      const lectures = await LectureModel.findAll({
        where: {
          schedule_id: id,
          is_votable: true
        },
        attributes: [
          'lecture_id',
          'name',
          'fio',
          'company',
          // Добавляем подсчет количества просмотров
          [sequelize.fn('COUNT', sequelize.col('views.lecture_id')), 'views']
        ],
        include: [{
          model: LectureViewsModel,
          as: 'views',
          attributes: [], // Не включаем сами объекты, только COUNT
          where: sequelize.literal(
            `EXTRACT(EPOCH FROM ("views"."end" - "views"."start")) > 300` // 300 сек = 5 мин
          ),
          required: false // INNER JOIN (только лекции с просмотрами > 5 мин)
        }],
        group: ['Lecture.lecture_id'], // Группировка по ID лекции
        raw: true // Для упрощенного вывода (опционально)
      })

      return await Promise.all(lectures.map(async lecture => {
        return {
          ...lecture,
          views: parseInt(lecture?.views as unknown as string),
          votes: await VoteModel.count({
            where: {
              lecture_id: lecture.lecture_id
            }
          })
        }
      }))
    } catch (error) {
      throw error
    }
  }
}

export default new VoteController()
