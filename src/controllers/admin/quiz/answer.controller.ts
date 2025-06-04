import AnswerModel from '@/models/admin/quiz/answer.model'
import type { answer } from '../types'

class AnswerController {
  async createAnswer (answers: answer[]) {
    try {
      return await AnswerModel.bulkCreate(answers)
    } catch (error) {
      throw error
    }
  }

  async updateAnswer ({ content, answer_id = null, is_right, img = null, question_id }: answer) {
    try {
      if (answer_id) {
        return await AnswerModel.update({
          is_right,
          content,
          img
        }, {
          returning: true,
          where: {
            answer_id
          }
        })
      } else {
        return await this.createAnswer([
          {
            content,
            is_right,
            img,
            question_id
          }
        ])
      }
    } catch (error) {
      throw error
    }
  }

  async deleteAnswer (answer_id: number) {
    try {
      const answer = await AnswerModel.findOne({
        where: {
          answer_id
        }
      })

      // @ts-ignore
      await answer.destroy()
    } catch (error) {
      throw error
    }
  }
}

export default new AnswerController()
