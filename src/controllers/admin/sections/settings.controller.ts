import SettingsModel from '@/models/admin/sections/settings'
import type { settings } from '../types'

class SettingsController {
  public async getSettings () {
    try {
      const response = await SettingsModel.findAll()

      if (!response.length) {
        const settings = await SettingsModel.create({
          title_ru: '',
          subtitle_ru: '',
          title_en: '',
          subtitle_en: '',
          favicon: ''
        })

        return settings.dataValues
      }

      return response[0]
    } catch (error) {
      throw error
    }
  }

  public async updateSettings ({ settings_id, title_ru = null, subtitle_ru = null, title_en = null, subtitle_en = null, favicon = null }: settings) {
    try {
      await SettingsModel.update({
        title_ru,
        subtitle_ru,
        title_en,
        subtitle_en,
        favicon
      }, {
        returning: true,
        where: {
          settings_id
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default new SettingsController()
