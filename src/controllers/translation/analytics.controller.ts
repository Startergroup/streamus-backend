import AnalyticsModel from '../../models/translation/analytics.model'
import { Op } from 'sequelize'
import type { analytics } from './types'
import { Sequelize } from 'sequelize-typescript'

class AnalyticsController {
  public async onUpdateSectionAnalytics ({ tab_id, user_id, start_time }: analytics): Promise<{ success: boolean } | null> {
    try {
      if (!(tab_id && user_id && start_time)) return null

      const target_record = await AnalyticsModel.findOne({
        where: {
          tab_id,
          user_id
        }
      })

      if (target_record?.dataValues) {
        await AnalyticsModel.update({
          end_time: start_time
        }, {
          where: {
            user_id,
            tab_id
          }
        })
      } else {
        await AnalyticsModel.create({
          tab_id,
          user_id,
          start_time,
          end_time: new Date().getTime()
        })
      }

      return {
        success: true
      }
    } catch (error) {
      throw error
    }
  }

  public async getAnalyticsByTabId (tab_id: number | string): Promise<{ success: boolean, views: analytics[] } | null> {
    try {
      if (!tab_id) return null

      const views: analytics[] = await AnalyticsModel.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('EXTRACT', Sequelize.literal("EPOCH FROM (end_time - start_time)")),
              '>',
              120
            ),
            { tab_id }
          ]
        }
      })

      return {
        success: true,
        views
      }
    } catch (error) {
      throw error
    }
  }
}

export default new AnalyticsController()
