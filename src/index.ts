import express from 'express'

import body_parser from 'body-parser'
import cors from 'cors'
import file_upload from 'express-fileupload'
import dotenv from 'dotenv'

import type { SequelizeOptions } from 'sequelize-typescript'
import DBConnection from './classes/dbConnection'
import AdminModels from './models/admin/index'
import TranslationModels from './models/translation/index'

import admin_auth_route from './routes/v1/admin/auth'
import admin_answer_route from './routes/v1/quiz/answer'
import admin_code_route from './routes/v1/translation/user'
import admin_file_route from './routes/v1/file'
import admin_quiz_route from './routes/v1/quiz/quiz'
import admin_question_route from './routes/v1/quiz/question'
import admin_presentation_route from './routes/v1/presentation'
import admin_settings_route from './routes/v1/translation/settings'
import admin_tab_route from './routes/v1/translation/tab'
import admin_user_auth_route from './routes/v1/user/auth'
import admin_vote_route from './routes/v1/vote'

import user_quiz_route from './routes/v1/user/quiz'
import user_vote_route from './routes/v1/user/vote'

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

// const verifyJWT = require('./middlewares/verifyJWT')
// const { ACCESS_TOKEN_SECRET } = process.env

// Дикий костыль, так как мне было впадлу думать над регуляркой
// app.use('/v1/answer', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/question', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/quiz', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/tab', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/tabs', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/code', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/file', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/presentation', verifyJWT(ACCESS_TOKEN_SECRET))
// app.use('/v1/vote', verifyJWT(ACCESS_TOKEN_SECRET))

app.use(admin_auth_route)
app.use(admin_answer_route)
app.use(admin_code_route)
app.use(admin_file_route)
app.use(admin_quiz_route)
app.use(admin_question_route)
app.use(admin_presentation_route)
app.use(admin_settings_route)
app.use(admin_tab_route)
app.use(admin_user_auth_route)
app.use(admin_vote_route)

app.use(user_quiz_route)
app.use(user_vote_route)

app.use(express.static('/root/startergroup-backend/public'))

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

db_admin_connection.initDbConnection()
db_translation_connection.initDbConnection()
