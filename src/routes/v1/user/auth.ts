import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import UserController from '../../../controllers/admin/user.controller'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({
  path: '.env.development'
})
// dotenv.config({
//   path: '.env.production'
// })

const CURRENT_ROUTE = `${ROUTES_VERSION}/user`
const router = Router()
const user_instance = new UserController()
const { USER_ACCESS_TOKEN_SECRET, USER_REFRESH_TOKEN_SECRET, ADMIN_TOKEN_DURATION } = process.env

router.post(`${CURRENT_ROUTE}/login`, async (req: any, res: any) => {
  try {
    const { code, name } = req.body

    if (!(code && name)) {
      res.status(400).send({
        success: false,
        message: 'Properties code and name are required.'
      })

      return
    }

    const user = (await user_instance.getCode(code))?.dataValues

    if (!user) {
      res.json({
        success: false,
        message: 'Проверьте, верный ли ключ вы ввели и нет ли в нем лишних знаков или пробелов.'
      })

      return
    }

    const { last_activity, code_id } = user
    const timeout = 15 * 1000
    // 60 min
    const token_expires = 60 * 60 * 1000

    if (Date.now() - last_activity >= timeout || last_activity === null) {
      const now = Date.now()
      const access_token = jwt.sign({}, USER_ACCESS_TOKEN_SECRET as string, { expiresIn: ADMIN_TOKEN_DURATION})
      const refresh_token = jwt.sign({}, USER_REFRESH_TOKEN_SECRET as string, { expiresIn: ADMIN_TOKEN_DURATION })

      await user_instance.updateUserData({
        code_id,
        name,
        last_activity: now,
        refresh_token
      })

      const updated_user = await user_instance.getCode(code)

      res.json({
        success: true,
        data: {
          ...updated_user?.dataValues,
          access_token,
          refresh_token,
          expires: Date.now() + token_expires
        }
      })
    } else {
      res.json({
        success: false,
        message: 'Ваш ключ активирован на другом устройстве. Выйдите из сессии на другом устройстве.'
      })
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(`${CURRENT_ROUTE}/update_activity`, async (req: any, res: any) => {
  try {
    const { code } = req.body

    if (!code) {
      res.status(403).send({
        success: false,
        message: 'User wasn\'t found.'
      })

      return
    }

    await user_instance.updateActivity(code)

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(`${CURRENT_ROUTE}/refresh_token`, async (req: any, res: any) => {
  try {
    const { refresh_token, code } = req.body

    if (!(refresh_token && code)) {
      res.status(403).send({
        success: false,
        message: 'Properties refresh_token and code are required.'
      })

      return
    }

    const user = (await user_instance.getCode(code))?.dataValues
    const is_valid_refresh_token = user.refresh_token === refresh_token

    if (is_valid_refresh_token) {
      const access_token = jwt.sign({}, USER_ACCESS_TOKEN_SECRET as string, { expiresIn: ADMIN_TOKEN_DURATION})
      const refresh_token = jwt.sign({}, USER_REFRESH_TOKEN_SECRET as string, { expiresIn: ADMIN_TOKEN_DURATION })
      // 60min
      const expires = 60 * 60 * 1000

      res.json({
        success: true,
        data: {
          access_token,
          refresh_token,
          expires
        }
      })
    } else {
      res.status(403).send({
        success: false,
        message: 'Unauthorized'
      })
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
