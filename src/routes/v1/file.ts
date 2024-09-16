import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'
import { UPLOAD_PATH } from '../../constants'
import { upload } from '../../utils/upload_file'

const CURRENT_ROUTE = `api/${ROUTES_VERSION}/file`
const router = Router()

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { files } = req

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send({
        success: false,
        message: 'No files were uploaded'
      })
    }

    const file = req.files.file
    const path = `${UPLOAD_PATH}/${file.name}`

    upload(file, path, () => {
      res.json({
        success: true,
        data: {
          name: file.name,
          path: path
        }
      })
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
