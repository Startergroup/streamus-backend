import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import VoteController from '../../../controllers/translation/vote.controller'

const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/user/vote`
const router = Router()
const vote_instance = new VoteController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { user_id, tab_id } = req.query
    const response = await vote_instance.getUserVotes({ user_id, tab_id })

    res.json({
      success: true,
      data: response
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { user_id, presentation_id, like } = req.body
    const response = await vote_instance.createVote({ user_id, presentation_id, like })

    res.json(response)
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
