import AdminModel from '../../../models/admin/admin.model'

class UserController {
  async compareHash (login: string, hash: string) {
    try {
      const user: AdminModel | null = await this.getUserByLogin(login)

      if (!user) {
        throw new Error('Пользовтель с таким логином не найден')
      }

      return hash === user.pass_hash
    } catch (error) {
      throw error
    }
  }

  async getSalt (login: string) {
    try {
      return await AdminModel.findOne({
        where: {
          login
        },
        attributes: ['salt']
      })
    } catch (error) {
      throw error
    }
  }

  async getUserByLogin (login: string = '') {
    try {
      return await AdminModel.findOne({
        where: {
          login
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default UserController
