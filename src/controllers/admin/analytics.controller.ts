import AnalyticsModel from '../../models/admin/analytics.model'
import TabModel from '../../models/admin/tab.model'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { analytics } from './types'

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

  public async getSectionsAnalytics (): Promise<{ success: boolean, views: analytics[] } | null> {
    try {
      const views: any[] = await AnalyticsModel.findAll({
        attributes: [
          'tab_id',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'views'],
          [Sequelize.col('tab.name'), 'tab_name']
        ],
        include: [{
          model: TabModel,
          as: 'tab',
          attributes: [],
          required: true
        }],
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('EXTRACT', Sequelize.literal("EPOCH FROM (end_time - start_time)")),
              '>',
              300 // 5 минут
            )
          ]
        },
        group: ['Analytics.tab_id', 'tab.name'],
        raw: true
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
