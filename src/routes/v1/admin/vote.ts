import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import VoteController from '../../../controllers/translation/vote.controller'

const router = Router()
const vote_instance = new VoteController()

router.get(`/api/${ROUTES_VERSION}/vote/report`, async (req: any, res: any) => {
  try {
    const { start, end } = req.query

    if (!(start && end)) {
      return res.json({
        success: false,
        message: 'Schedule id is required.'
      })
    }

    const votes = await vote_instance.getReportVote({ start, end })

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

router.get(`/api/${ROUTES_VERSION}/vote/report-by-section`, async (req: any, res: any) => {
  try {
    const { id } = req.query

    if (!id) {
      return res.json({
        success: false,
        message: 'Property id is required.'
      })
    }

    const votes = await vote_instance.getReportBySection(id)

    return res.json({
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
