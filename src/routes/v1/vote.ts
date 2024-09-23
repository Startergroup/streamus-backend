import PresentationController from '../../controllers/admin/presentation.controller'
import VoteController from '../../controllers/admin/vote.controller'
import VoteUserController from '../../controllers/translation/vote.controller'
import Excel from 'exceljs'
import type { presentation } from '../../controllers/admin/types'
import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'
import { upload } from '../../utils/upload_file'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/vote`
const presentation_instance = new PresentationController()
const vote_instance = new VoteController()
const vote_user_instance = new VoteUserController()

router.get(`/api/${ROUTES_VERSION}/votes`, async (req: any, res: any) => {
  try {
    const { tab_id } = req.query

    if (!tab_id) {
      res.status(400).send({
        success: false,
        message: 'Property tab_id is required.'
      })

      return
    }

    const votes = await vote_instance.getVotesByTabID(tab_id)

    res.json({
      success: true,
      data: votes
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { vote_id } = req.query
    const votes = vote_id ? await vote_instance.getVote(vote_id) : await vote_instance.getVotes()

    res.json({
      success: true,
      data: votes
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`${CURRENT_ROUTE}/report`, async (req: any, res: any) => {
  try {
    const { vote_id } = req.query

    if (!vote_id) {
      return res.status(400).send({
        success: false,
        message: 'Property vote_id is required.'
      })
    }

    const presentations = await presentation_instance.getPresentations(vote_id)

    for (let i = 0; i < presentations.length; i++) {
      const presentation = presentations[i]
      const votes = await vote_user_instance.getLikeVotes(presentation.presentation_id)

      presentation.dataValues.likes = votes.length
    }

    res.json({
      success: true,
      data: presentations
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_name, tab_id, presentations } = req.body

    if (!(tab_name && tab_id && presentations.length)) {
      res.status(400).send({
        success: false,
        message: 'You have to send array of object like [{ tab_id, tab_name, presentations: [] }].'
      })

      return
    }

    const vote = await vote_instance.createVote({ tab_id, tab_name })
    const mapped_presentations = presentations.map((item: presentation) => {
      return {
        ...item,
        vote_id: vote.dataValues.vote_id
      }
    })
    const response = await presentation_instance.createPresentations(mapped_presentations)

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(`${CURRENT_ROUTE}/import`, async (req: any, res: any) => {
  try {
    const { files } = req

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send({
        success: false,
        message: 'No files were uploaded'
      })
    }

    const file = req.files.file
    const path = `C:\\Users\\Maikl\\Desktop\\Startergroup\\Streamus apps\\admin-panel\\packages\\server\\public\\uploads\\${file.name}`

    upload(file, path, async () => {
      const workbook = new Excel.Workbook()

      workbook.xlsx.readFile(path).then((sheet: any) => {
        const worksheet = workbook.getWorksheet(sheet.worksheets[0].name)
        // @ts-ignore
        worksheet.eachRow({ includeEmpty: false }, function(row) {
          const values = JSON.stringify(row.values)
          console.debug(values)
        });
      })
    })

    // const workbook = new Excel.Workbook()
    // const data = await workbook.xlsx.readFile(file)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_name, tab_id, vote_id } = req.body

    if (!(tab_name && tab_id && vote_id)) {
      res.status(400).send({
        success: false,
        message: 'Properties tab_name, tab_id and vote_id are required.'
      })

      return
    }

    const response = await vote_instance.updateVote({ tab_name, tab_id, vote_id })
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { vote_id } = req.body

    if (!vote_id) {
      res.json({
        success: false,
        message: 'Property vote_id is required.'
      })

      return
    }

    const response = await vote_instance.deleteVote(vote_id)
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
