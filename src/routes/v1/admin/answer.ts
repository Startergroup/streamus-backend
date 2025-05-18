import AnswerController from '@/controllers/admin/answer.controller'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/answer`

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { answer_id } = req.body

  if (!answer_id) {
    return res.status(400).send({
      success: false,
      message: 'Parameter question_id is required.'
    })
  }

  try {
    await AnswerController.deleteAnswer(answer_id)

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
