import tab_model from '../../models/admin/tab.model'
import type { tab } from './types'

class TabController {
  public async createTab ({ name, url, order }: tab) {
    try {
      await tab_model.create({
        name,
        url,
        order
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async getTabByName (name: string) {
    try {
      return await tab_model.findOne({
        where: {
          name
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getTab (tab_id: number) {
    try {
      return await tab_model.findOne({
        where: {
          tab_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getTabs () {
    try {
      return await tab_model.findAll()
    } catch(error) {
      throw error
    }
  }

  public async updateTab ({ tab_id, name, url, order }: tab) {
    try {
      await tab_model.update({
        name,
        url,
        order
      }, {
        returning: true,
        where: {
          tab_id
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

  public async deleteTab (tab_id: number) {
    try {
      const tab = await this.getTab(tab_id)

      if (!tab) {
        return {
          success: false,
          message: 'Tab wasn\'t found'
        }
      }

      // @ts-ignore
      await tab.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default TabController
