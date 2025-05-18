import UserController from '@/controllers/admin/user.controller'
import fs from 'fs'
import { Router } from 'express'
import { ROUTES_VERSION, UPLOAD_PATH } from '@/constants'
import { upload } from '@/utils/upload-file'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/code`

router.get(`/api/${ROUTES_VERSION}/codes`, async (_req: any, res: any) => {
  try {
    const codes = await UserController.getCodes()

    res.json({
      success: true,
      data: codes
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).send({
        success: false,
        message: 'Property code is required.'
      })
    }

    const response = await UserController.createCode({ code })
    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(`/api/${ROUTES_VERSION}/codes`, async (req: any, res: any) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded')
  }

  try {
    UserController.importCodesFromFile(req.files.file)

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code_id, code } = req.body

    if (!(code_id && code)) {
      return res.status(400).send({
        success: false,
        message: 'Properties code and code_id are required.'
      })
    }

    const response = await UserController.updateCode({ code_id, code })

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(`${CURRENT_ROUTE}/user`, async (req: any, res: any) => {
  try {
    const { code_id, name, email } = req.body

    if (!(code_id && name && email)) {
      return res.status(400).send({
        success: false,
        message: 'Properties code_id, name and email are required.'
      })
    }

    const last_activity = Date.now()
    const response = await UserController.updateUserData({ code_id, name, email, last_activity })

    return res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code_id } = req.body

    if (!code_id) {
      return res.status(400).send({
        success: false,
        message: 'Property code_id is required.'
      })
    }

    const response = await UserController.deleteCode(code_id)

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete(`/api/${ROUTES_VERSION}/codes`, async (_req: any, res: any) => {
  try {
    const response = await UserController.deleteCodes()

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(`/api/${ROUTES_VERSION}/codes/import`, async (req: any, res: any) => {
  try {
    const { files } = req

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send({
        success: false,
        message: 'No files were uploaded'
      })
    }

    const file = files.file
    const upload_path = `${UPLOAD_PATH}/${file.name}`

    upload(file, upload_path, async () => {
      const codes = fs.readFileSync(upload_path, 'utf-8').replace(/\s+/g, ' ')
      const array_codes = codes.split(' ')
      const mapped_codes = array_codes.map(item => {
        return {
          code: item,
          name: null,
          email: null,
          last_activity: null
        }
      })

      await UserController.createCodes(mapped_codes as [])

      res.json({
        success: true,
        message: 'OK'
      })
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`/api/${ROUTES_VERSION}/codes/generate`, async (req: any, res: any) => {
  const { key_count, key_length } = req.query

  await UserController.generateCodes(key_count, key_length)

  res.json({
    success: true
  })
})

export default router
