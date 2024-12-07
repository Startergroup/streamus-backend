import { Router } from 'express'
import type { Request, Response } from 'express'
import asyncWrapper from '../../../wrappers/async-wrapper'
import jwt from 'jsonwebtoken'
import UserController from '../../../controllers/v2/admin/user.controller'

const router = Router()
const userController = new UserController()

router.post('/auth', asyncWrapper(async (req: Request, res: Response) => {
  const { login = null, pass = null } = req.body

  if (!(login && pass)) {
    throw new Error('Свойства login и pass обязательны')
  }

  const is_pass_valid = await userController.compareHash(login, pass)

  if (!is_pass_valid) {
    res.json({
      success: false,
      valid: false
    })

    return
  }

  const access_token = jwt.sign({ login }, (process.env.ACCESS_TOKEN_SECRET as string), { expiresIn: process.env.ADMIN_TOKEN_DURATION })
  const refresh_token = jwt.sign({ login }, (process.env.ADMIN_REFRESH_TOKEN_SECRET as string))

  res.json({
    accessToken: access_token,
    refreshToken: refresh_token,
    success: true
  })
}))

router.get('/check_token', asyncWrapper(async (req: Request, res: Response) => {
  const header:string|undefined = req.headers?.authorization
  const token = header ? header.split(' ')[1] : null

  if (!token) {
    res.status(403).json({
      expired: true
    })

    return
  }

  jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET as string), (error: any) => {
    if (error) {
      throw error
    }

    res.json({
      expired: false
    })
  })
}))

router.post('/check_user', asyncWrapper(async (req: Request, res: Response) => {
  const { login = null } = req.body

  if (!login) {
    throw new Error('Свойство login обязательно')
  }

  const user = await userController.getUserByLogin(login)

  if (!user) {
    throw new Error('Пользователь не найден')
  }

  const salt = await userController.getSalt(login)

  if (!salt) {
    throw new Error('Свойство salt не было найдено')
  }

  res.json(salt)
}))

export default router
