import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'
import PresentationController from '../../controllers/admin/presentation.controller'

const CURRENT_ROUTE = `${ROUTES_VERSION}/presentation`
const router = Router()
const presentation_instance = new PresentationController()

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { name = null, vote_id } = req.body

    if (!(name !== null && vote_id)) {
      res.status(400).send({
        success: false,
        message: 'Properties name and vote_id are required.'
      })

      return
    }

    const response = await presentation_instance.createPresentation({ name, vote_id })
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { name, presentation_id } = req.body

    if (!(name && presentation_id)) {
      res.status(400).send({
        success: false,
        message: 'Properties name and vote_id are required.'
      })

      return
    }

    const response = await presentation_instance.updatePresentation({ name, presentation_id })
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { presentation_id } = req.body

    if (!presentation_id) {
      res.status(400).send({
        success: false,
        message: 'Property vote_id is required.'
      })

      return
    }

    const response = await presentation_instance.deletePresentation(presentation_id)
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
