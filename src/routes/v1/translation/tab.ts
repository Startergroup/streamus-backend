import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'

import TabController from '../../../controllers/admin/tab.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/tab`

const tab_instance = new TabController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id } = req.params
    const tab = await tab_instance.getTab(tab_id)

    res.json({
      success: true,
      data: tab
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get(`${ROUTES_VERSION}/tabs`, async (_req: any, res :any) => {
  try {
    const tabs = await tab_instance.getTabs()
    res.json({
      success: true,
      data: tabs
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { name, url, order, schedule } = req.body

    if (!(name && url && order !== null)) {
      return res.status(400).send({
        success: false,
        message: 'Properties name, order and url are required.'
      })
    }

    const response = await tab_instance.createTab({ name, url, order, schedule })

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id, name, url, order, schedule } = req.body

    if (!(tab_id && name && url && order !== null)) {
      return res.status(400).send({
        success: false,
        message: 'Properties tab_id, name, order and url are required.'
      })
    }

    const response = await tab_instance.updateTab({ tab_id, name, url, order, schedule })

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id } = req.body

    if (!tab_id) {
      return res.status(400).send({
        success: false,
        message: 'Property tab_id is required.'
      })
    }

    const response = await tab_instance.deleteTab(tab_id)

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router
