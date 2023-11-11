import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'

import AnswerController from '../../../controllers/admin/answer.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/answer`

const answer_instance = new AnswerController()

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { answer_id } = req.body

  if (!answer_id) {
    return res.status(400).send({
      success: false,
      message: 'Parameter question_id is required.'
    })
  }

  try {
    await answer_instance.deleteAnswer(answer_id)

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
