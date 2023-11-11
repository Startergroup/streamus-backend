import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'

import QuestionController from '../../../controllers/admin/question.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/question`

const question_instance = new QuestionController()

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { question_id } = req.body

  if (!question_id) {
    return res.status(400).send({
      success: false,
      message: 'Parameter question_id is required.'
    })
  }

  try {
    await question_instance.deleteQuestion(question_id)

    return res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
