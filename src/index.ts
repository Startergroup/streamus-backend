import 'tsconfig-paths/register.js'

import Express from 'express'
import ExpressWS from 'express-ws'
import body_parser from 'body-parser'
import cors from 'cors'
import file_upload from 'express-fileupload'
import dotenv from 'dotenv'
import type { SequelizeOptions } from 'sequelize-typescript'

// Classes
import DBConnection from '@/classes/db-connection'
// Models
import AdminModels from '@/models/admin/index'
import TranslationModels from '@/models/translation/index'
// Routes
import AdminRoutes from '@/routes/v1/admin'
import TranslationRoutes from '@/routes/v1/translation'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const app = Express() as unknown as ExpressWS.Application
const port = Number(process.env.SERVER_PORT)

ExpressWS(app)

if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}

app.use(file_upload({}))
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))

const routes = [...AdminRoutes, ...TranslationRoutes]
routes.forEach(route => {
  app.use(route)
})

app.use(Express.static('/root/startergroup-backend/public'))

app.listen(port, async () => {
  console.log(`➜ 🎸 Server is listening on port: ${port}`)

  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_ADMIN_DB,
    POSTGRES_TRANSLATION_DB
  } = process.env
  const base_options: SequelizeOptions = {
    port: POSTGRES_PORT as unknown as number,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  }

  new DBConnection({ ...base_options, database: POSTGRES_ADMIN_DB }, AdminModels).initDbConnection()
  new DBConnection({ ...base_options, database: POSTGRES_TRANSLATION_DB }, TranslationModels).initDbConnection()
})
