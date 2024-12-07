import express from 'express'

import body_parser from 'body-parser'
import cors from 'cors'
import file_upload from 'express-fileupload'
import dotenv from 'dotenv'

import type { SequelizeOptions } from 'sequelize-typescript'
import DBConnection from './classes/dbConnection'
import AdminModels from './models/admin/index'
import TranslationModels from './models/translation/index'

// Import and registration routes
import RoutesV1 from './routes/v1/index'
import RoutesV2 from './routes/v2/admin/index'
import RegisterRoutes from './utils/register-routes'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const app = express()
const port = Number(process.env.SERVER_PORT)

if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}

app.use(file_upload({}))
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static('/root/startergroup-backend/public'))

// Registrations routes
RegisterRoutes(app, RoutesV1)
RegisterRoutes(app, RoutesV2, '/api/v2/admin')

app.listen(port, async () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})

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
const db_admin_connection = new DBConnection({ ...base_options, database: POSTGRES_ADMIN_DB }, AdminModels)
const db_translation_connection = new DBConnection({ ...base_options, database: POSTGRES_TRANSLATION_DB }, TranslationModels)

db_admin_connection.initDbConnection('admin')
db_translation_connection.initDbConnection('translation')
