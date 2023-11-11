import admin_model from '../../models/admin/admin.model'

class AdminController {
  private async getUser (login: string) {
    try {
      const user = await admin_model.findOne({
        where: {
          login
        }
      })

      if (!user) {
        return {
          success: false,
          message: 'User wasn\'t found.'
        }
      }

      return {
        success: true,
        data: user
      }
    } catch (error) {
      throw error
    }
  }

  public async getUserSalt (login: string) {
    try {
      return await admin_model.findOne({
        where: {
          login
        },
        attributes: ['salt']
      })
    } catch (error) {
      throw error
    }
  }

  public async comparePasswordHash (login: string, pass_hash: string): Promise<boolean> {
    try {
      const user = await this.getUser(login)

      if (!user.success) {
        return false
      }

      return pass_hash === (user.data as admin_model).dataValues.pass_hash
    } catch (error) {
      throw error
    }
  }
}

export default AdminController
