import ChatController from '@/controllers/admin/chat/chat.controller'
import TabController from '@/controllers/admin/sections/tab.controller'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/tab`

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id } = req.params
    const tab = await TabController.getTab(tab_id)

    res.json({
      success: true,
      data: tab
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get(`/api/${ROUTES_VERSION}/tabs`, async (_req: any, res :any) => {
  try {
    const tabs = await TabController.getTabs()
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
    const { name, url, order } = req.body

    if (!(name && url && order !== null)) {
      return res.status(400).send({
        success: false,
        message: 'Properties name, order and url are required.'
      })
    }

    const {
      success,
      message,
      data
    } = await TabController.createTab({ name, url, order }) || {}

    await ChatController.createChat(data?.tab_id)

    res.json({
      success,
      message
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id, name, url, order } = req.body

    if (!(tab_id && name && url && order !== null)) {
      return res.status(400).send({
        success: false,
        message: 'Properties tab_id, name, order and url are required.'
      })
    }

    const response = await TabController.updateTab({ tab_id, name, url, order })

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

    const response = await TabController.deleteTab(tab_id)

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router
