import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import VoteController from '../../../controllers/translation/vote.controller'

const router = Router()
const vote_instance = new VoteController()

router.get(`/api/${ROUTES_VERSION}/vote/report`, async (req: any, res: any) => {
  try {
    const { schedule_id } = req.query

    if (!schedule_id) {
      return res.json({
        success: false,
        message: 'Schedule id is required.'
      })
    }

    const votes = await vote_instance.getVoteReport(schedule_id)

    res.json({
      success: true,
      votes
    })
  } catch (error) {
    console.error(error)

    res.json({
      success: false,
      message: error
    })
  }
})

export default router
