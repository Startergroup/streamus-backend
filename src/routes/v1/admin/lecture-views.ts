import LectureViewsController from '@/controllers/translation/lecture-views.controller'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/lecture/views`

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const {
      user_id = null,
      lecture_id = null,
      timestamp
    } = req.body

    if (!(user_id && lecture_id && timestamp)) {
      return res.status(400).json({
        success: false,
        message: 'Properties user_id, lecture_id and start are required.'
      })
    }

    await LectureViewsController.recordView({
      lecture_id,
      user_id,
      timestamp
    })

    return res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

export default router
