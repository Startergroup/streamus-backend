import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import QuizAdminController from '../../../controllers/admin/quiz.controller'
import QuizTranslationController from '../../../controllers/translation/quiz.controller'
import UserController from '../../../controllers/admin/user.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/user/quiz`
const quiz_admin_instance = new QuizAdminController()
const quiz_translation_instance = new QuizTranslationController()
const user_instance = new UserController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { user_id } = req.query
    const quizzes = await quiz_admin_instance.getQuizzes(true, user_id)

    res.json({
      success: true,
      data: quizzes
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`${CURRENT_ROUTE}/rate`, async (req: any, res: any) => {
  try {
    const { quiz_id } = req.query
    const quizzes = await quiz_translation_instance.getQuizzes(quiz_id)

    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i].dataValues
      const user = await user_instance.getCodeByID(quiz.user_id)

      quiz.username = user?.dataValues.name
      quiz.email = user?.dataValues.email
    }

    res.json(quizzes)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { quiz_id, user_id, answers, time } = req.body

    if (!(quiz_id && user_id && answers && time !== null)) {
      res.status(400).send({
        success: false,
        message: 'Properties quiz_id, user_id, answers and time are required.'
      })

      return
    }

    const response = await quiz_translation_instance.createQuiz({
      quiz_id,
      user_id,
      answers,
      time
    })

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
