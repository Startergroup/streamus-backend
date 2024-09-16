import { Router} from 'express'
import { ROUTES_VERSION } from '../../../constants'
import SettingsController from '../../../controllers/admin/settings.controller'

const CURRENT_ROUTE = `api/${ROUTES_VERSION}/settings`
const router = Router()
const settings_instance = new SettingsController()

router.get(CURRENT_ROUTE, async (_req: any, res: any) => {
  try {
    const settings = await settings_instance.getSettings()

    res.json({
      success: true,
      data: settings
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { settings_id, title_ru, subtitle_ru, title_en, subtitle_en, favicon } = req.body

    if (!settings_id) {
      return res.status(400).send({
        success: false,
        message: 'Property settings_id is required.'
      })
    }

    const response = await settings_instance.updateSettings({
      settings_id,
      title_ru,
      subtitle_ru,
      title_en,
      subtitle_en,
      favicon
    })

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
