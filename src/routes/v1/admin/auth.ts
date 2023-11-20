import { Router } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { ROUTES_VERSION } from '../../../constants'
import AdminController from '../../../controllers/admin/admin.controller'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const router = Router()
const {
  ADMIN_ACCESS_TOKEN_SECRET,
  ADMIN_REFRESH_TOKEN_SECRET,
  ADMIN_TOKEN_DURATION
} = process.env
const refresh_tokens = []
const CURRENT_ROUTE = `${ROUTES_VERSION}/admin`
const admin_instance = new AdminController()

router.post(`${CURRENT_ROUTE}/check_user`, async (req: any, res: any) => {
  const { login } = req.body

  if (!login) {
    return res.status(400).send({
      success: false,
      message: 'Parameter login is required.'
    })
  }

  try {
    const user_salt = await admin_instance.getUserSalt(login)

    return res.json({
      success: true,
      data: user_salt
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(`${CURRENT_ROUTE}/login`, async (req: any, res: any) => {
  const { login, pass } = req.body

  if (!(login && pass)) {
    return res.status(400).send({
      success: false,
      message: 'User wasn\'t found.'
    })
  }

  try {
    const is_pass_valid = await admin_instance.comparePasswordHash(login, pass)

    if (!is_pass_valid) {
      return res.json({
        success: is_pass_valid,
        data: {
          is_valid: is_pass_valid
        }
      })
    }

    const access_token = jwt.sign({ login }, (ADMIN_ACCESS_TOKEN_SECRET as string), { expiresIn: ADMIN_TOKEN_DURATION })
    const refresh_token = jwt.sign({ login }, (ADMIN_REFRESH_TOKEN_SECRET as string))

    refresh_tokens.push(refresh_token)

    return res.json({
      success: true,
      accessToken: access_token,
      refreshToken: refresh_token
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`${CURRENT_ROUTE}/check_token`, async (req: any, res: any) => {
  const auth_header = req.headers.authorization

  if (auth_header) {
    const token = auth_header.split(' ')[1]

    jwt.verify(token, (ADMIN_ACCESS_TOKEN_SECRET as string), (error: any) => {
      if (error) {
        return res.status(403).json({
          expired: true,
          message: error
        })
      }

      return res.json({
        expired: false
      })
    })
  } else {
    res.sendStatus(403)
  }
})

export default router
