import QuizModel from '../../models/translation/quiz.model'
import AnswerModel from '../../models/admin/answers.model'
import type { answer, quiz } from './types'

class QuizController {
  public async createQuiz ({ quiz_id, user_id, time, answers }: quiz) {
    try {
      const is_passed = await QuizModel.findOne({
        where: {
          user_id
        }
      })

      if (is_passed) {
        return {
          success: false,
          message: 'User already passed this quiz.'
        }
      }

      const points = await this.calculatingPoints(answers as answer[])

      await QuizModel.create({
        quiz_id,
        user_id,
        time,
        points
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async calculatingPoints(answers: answer[]) {
    let points = 0

    for (let i = 0; i < answers.length; i++) {
      const answer = await AnswerModel.findOne({ where: { answer_id: answers[i].answer_id } })
      const point = answer?.dataValues ? answer.dataValues.is_right : 0

      points += Number(point)
    }

    return points
  }

  public async getQuizzes (quiz_id: number) {
    try {
      return await QuizModel.findAll({
        where: {
          quiz_id
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default QuizController
