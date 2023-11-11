import question_model from '../../models/admin/question.model'
import type { question } from './types'

class QuestionController {
  async createQuestion (questions: question[]) {
    try {
      return await question_model.bulkCreate(questions)
    } catch (error) {
      throw error
    }
  }

  async updateQuestion ({ quiz_id = null, question_id = null, content, img = null }: question) {
    try {
      if (!question_id) {
        return await this.createQuestion([{ quiz_id, content, img, answers: [] }])
      } else {
        const updated_question = await question_model.update({
          content,
          img
        }, {
          returning: true,
          where: {
            question_id
          }
        })

        // @ts-ignore
        return updated_question[1]
      }
    } catch (error) {
      throw error
    }
  }

  async deleteQuestion (question_id:number) {
    try {
      const question = await question_model.findOne({
        where: {
          question_id
        }
      })

      // @ts-ignore
      await question.destroy()
    } catch (error) {
      throw error
    }
  }
}

export default QuestionController
