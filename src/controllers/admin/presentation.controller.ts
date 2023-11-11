import PresentationsModel from '../../models/admin/presentations.model'
import type { presentation } from './types'

class PresentationController {
  public async getPresentations (vote_id: number) {
    try {
      return await PresentationsModel.findAll({
        where: {
          vote_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getPresentation (id: number) {
    try {
      return await PresentationsModel.findOne({
        where: {
          presentation_id: id
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async createPresentations (presentations: presentation[]) {
    try {
      await PresentationsModel.bulkCreate(presentations)

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async createPresentation ({ name, vote_id }: presentation) {
    try {
      return await PresentationsModel.create({
        name,
        vote_id
      })
    } catch (error) {
      throw error
    }
  }

  public async deletePresentation (id: number) {
    try {
      const presentation = await this.getPresentation(id)

      if (!presentation) {
        return {
          success: false,
          message: 'Presentation wasn\'t found'
        }
      }

      // @ts-ignore
      await presentation.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async updatePresentation ({ presentation_id, name }: presentation) {
    try {
      await PresentationsModel.update({
        name
      }, {
        returning: true,
        where: {
          presentation_id
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

export default PresentationController
