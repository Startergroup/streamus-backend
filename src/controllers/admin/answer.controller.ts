import answers_model from '../../models/admin/answers.model'
import type { answer } from './types'

class AnswerController {
  async createAnswer (answers: answer[]) {
    try {
      return await answers_model.bulkCreate(answers)
    } catch (error) {
      throw error
    }
  }

  async updateAnswer ({ content, answer_id = null, is_right, img = null, question_id }: answer) {
    try {
      if (answer_id) {
        return await answers_model.update({
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
      const answer = await answers_model.findOne({
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

export default AnswerController
