import {type Response, Router} from 'express'
import type { Request } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import AnalyticsController from '../../../controllers/admin/analytics.controller'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/analytics/section-views`

router.get(CURRENT_ROUTE, async (_req: Request, res: Response):Promise<any> => {
  try {
    const response = await AnalyticsController.getSectionsAnalytics()

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(CURRENT_ROUTE, async (req: Request, res: Response) => {
  try {
    const { tab_id, user_id, start_time } = req.body
    const { success = false } = await AnalyticsController.onUpdateSectionAnalytics({ tab_id, user_id, start_time }) || {}

    res.json({
      success
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router
