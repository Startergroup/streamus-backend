import QuizAdminController from '@/controllers/admin/quiz.controller'
import QuizTranslationController from '@/controllers/translation/quiz.controller'
import UserController from '@/controllers/admin/user.controller'
import sortByTimeAndPoints from '@/utils/sort-by-time-and-points'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/user/quiz`

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { user_id } = req.query
    const quizzes = await QuizAdminController.getQuizzes(true, user_id)

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
    const quizzes = await QuizTranslationController.getQuizzes(quiz_id)

    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i].dataValues
      const user = await UserController.getCodeByID(quiz.user_id)

      quiz.username = user?.dataValues.name
      quiz.email = user?.dataValues.email
    }

    res.json(quizzes.sort(sortByTimeAndPoints))
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

    const response = await QuizTranslationController.createQuiz({
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
