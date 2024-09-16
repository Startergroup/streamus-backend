import UserModel from '../../models/admin/user.model'
import type { code } from './types'
import { UPLOAD_PATH } from '../../constants'
import fs from 'fs'

class UserController {
  public async createCode ({ code }: code) {
    try {
      const targetCode = await this.getCode(code as string)

      if (targetCode) {
        return {
          success: false,
          message: 'Такой код уже существует'
        }
      }

      await UserModel.create({
        code,
        name: null,
        email: null,
        last_activity: null
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async createCodes (codes: code[]) {
    try {
      await UserModel.bulkCreate(codes)

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async getCode (code: string) {
    try {
      return await UserModel.findOne({
        where: {
          code
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getCodeByID (code_id: string) {
    try {
      return await UserModel.findOne({
        where: {
          code_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async getCodes () {
    try {
      return await UserModel.findAll()
    } catch (error) {
      throw error
    }
  }

  public importCodesFromFile (file: any) {
    const upload_path = `${UPLOAD_PATH}/${file.name}`

    file.mv(upload_path, async () => {
      try {
        const codes = fs.readFileSync(upload_path, 'utf-8').replace(/\s+/g, ' ')
        const array_codes = codes.split(' ')
        const mapped_codes = array_codes.map((item) => {
          return {
            code: item,
            last_activity: null,
            is_online: false
          }
        })

        await this.createCodes(Array.from(new Set(mapped_codes)))
      } catch (error) {
        throw error
      }
    })
  }

  public async updateCode ({ code_id, code }: code) {
    try {
      await UserModel.update({
        code
      }, {
        returning: true,
        where: {
          code_id
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

  public async deleteCode (code_id: string) {
    try {
      const code = await this.getCodeByID(code_id)

      if (!code) {
        return {
          success: false,
          message: 'Code wasnt\'t found.'
        }
      }

      // @ts-ignore
      await code.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async deleteCodes () {
    try {
      await UserModel.truncate({ cascade: true })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async updateUserData ({ code_id, name, email = '', last_activity, refresh_token = null }: code) {
    try {
      await UserModel.update({
        name,
        email,
        last_activity,
        refresh_token
      }, {
        returning: true,
        where: {
          code_id
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

  public async updateActivity (code: string) {
    try {
      const user = await UserModel.findOne({
        where: {
          code
        }
      })

      if (!user) {
        return {
          success: false,
          message: 'User wasnt found'
        }
      }

      await UserModel.update({
        last_activity: Date.now()
      }, {
        returning: true,
        where: {
          code
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

export default UserController
