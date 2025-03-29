import AnswersModel from '../../models/admin/answers.model'
import QuizModel from '../../models/admin/quiz.model'
import QuestionModel from '../../models/admin/question.model'
import QuizTranslationModel from '../../models/translation/quiz.model'
import type { quiz } from './types'

class QuizController {
  async getQuizzes (is_user = false, user_id: number | null = null) {
    try {
      const excluded_attrs = is_user ? ['is_right'] : []
      const quizzes = await QuizModel.findAll({
        include: [
          {
            model: QuestionModel,
            include: [{
              model: AnswersModel,
              attributes: {
                exclude: excluded_attrs
              }
            }]
          }
        ]
      })

      if (is_user) {
        for (let i = 0; i < quizzes.length; i++) {
          const quiz = quizzes[i].dataValues
          const is_passed = await QuizTranslationModel.findOne({
            where: {
              quiz_id: quiz.quiz_id,
              user_id
            }
          })

          quiz.is_passed = !!is_passed
        }

        return quizzes
      }

      return quizzes
    } catch (error) {
      throw error
    }
  }

  async getQuiz (quiz_id:number) {
    try {
      return await QuizModel.findOne({
        where: {
          quiz_id
        },
        include: QuestionModel
      })
    } catch (error) {
      throw error
    }
  }

  async createQuiz ({ name, introduction_text, duration, logo, background }: quiz) {
    try {
      return await QuizModel.create({
        name,
        introduction_text,
        duration,
        logo,
        background
      })
    } catch (error) {
      throw error
    }
  }

  async deleteQuiz (quiz_id: number) {
    try {
      const quiz = await this.getQuiz(quiz_id)

      if (!quiz) {
        return {
          success: false,
          message: 'Quiz wasn\'t found'
        }
      }

      // @ts-ignore
      await quiz.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  async deleteQuizzes () {
    try {
      await QuizModel.truncate({ cascade: true })
    } catch (error) {
      throw error
    }
  }

  async updateQuiz ({ quiz_id, name, introduction_text, duration, logo, background }: quiz) {
    try {
      await QuizModel.update({
        name,
        introduction_text,
        duration,
        logo,
        background
      }, {
        returning: true,
        where: {
          quiz_id: quiz_id as number
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  async switchState ({ quiz_id, value }: { quiz_id: number, value: boolean }) {
    try {
      await QuizModel.update({
        is_active: value
      }, {
        returning: true,
        where: {
          quiz_id
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default QuizController
