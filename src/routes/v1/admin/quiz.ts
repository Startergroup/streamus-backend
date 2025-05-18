import AnswerController from '@/controllers/admin/answer.controller'
import QuizController from '@/controllers/admin/quiz.controller'
import QuestionController from '@/controllers/admin/question.controller'
import UserQuizController from '@/controllers/translation/quiz.controller'
import UserController from '@/controllers/admin/user.controller'
import sortByTimeAndPoints from '@/utils/sort-by-time-and-points'
import type { answer, question } from '@/controllers/admin/types'
import { Router } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const CURRENT_ROUTE = `/api/${ROUTES_VERSION}/quiz`

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  const { quiz_id = null } = req.query

  if (!quiz_id) {
    return res.status(400).send({
      success: false,
      message: 'Param quiz_id is required.'
    })
  }

  try {
    const quiz = await QuizController.getQuiz(parseInt(quiz_id))

    return res.json({
      success: true,
      data: quiz
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`/api/${ROUTES_VERSION}/quizzes`, async (_req: any, res: any) => {
  try {
    const quizzes = await QuizController.getQuizzes()

    res.json({
      success: true,
      data: quizzes
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  const { name, introduction_text, duration, logo, background, questions } = req.body

  if (!(name && introduction_text && duration && logo && background && questions)) {
    return res.status(400).send({
      success: false,
      message: 'Properties name, introduction_text, duration, logo, background and questions are required.'
    })
  }

  try {
    const quiz: any = await QuizController.createQuiz({
      name,
      introduction_text,
      duration,
      logo,
      background
    })
    const mapped_questions = questions.map((item: question) => {
      return {
        ...item,
        quiz_id: quiz.dataValues.quiz_id
      }
    })
    const added_questions = await QuestionController.createQuestion(mapped_questions)
    const answers = questions.map((item: question) => {
      return item.answers
    })
    const mapped_answers = answers.map((item: answer|answer[], index: number) => {
      return (item as answer[]).map((answer: answer) => {
        return {
          ...answer,
          question_id: added_questions[index].dataValues.question_id
        }
      })
    })

    await Promise.all(mapped_answers.map(async (item: answer[]) => {
      await AnswerController.createAnswer(item)
    }))

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  const { name, quiz_id, introduction_text, duration, logo, background, questions } = req.body

  if (!(name && introduction_text && duration && logo && background && questions)) {
    return res.status(400).send({
      success: false,
      message: 'Properties introduction_text, duration, logo, background and questions are required.'
    })
  }

  try {
    await QuizController.updateQuiz({
      name,
      quiz_id,
      introduction_text,
      duration,
      logo,
      background
    })

    await Promise.all(questions.map(async (question: question) => {
      const updated_question = await QuestionController.updateQuestion({ ...question, quiz_id })
      const { answers } = question

      await Promise.all(answers.map(async (answer: answer) => {
        await AnswerController.updateAnswer({
          ...answer,
          // @ts-ignore
          question_id: updated_question[0].dataValues.question_id
        })
      }))
    }))

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(`${CURRENT_ROUTE}/switch_state`, async (req: any, res: any) => {
  const { quiz_id, value = null } = req.body

  if (!(quiz_id && !(value === null))) {
    return res.status(400).send({
      success: false,
      message: 'Properties quiz_id and value are required.'
    })
  }

  const response = await QuizController.switchState({ quiz_id, value })

  if (response.success) {
    return res.json(response)
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { quiz_id = null } = req.body

  if (!quiz_id) {
    return res.status(400).send({
      success: false,
      message: 'Param quiz_id is required.'
    })
  }

  try {
    const response = await QuizController.deleteQuiz(quiz_id)

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(`/api/${ROUTES_VERSION}/quizzes`, async (_req: any, res: any) => {
  try {
    await QuizController.deleteQuizzes()

    return res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`${CURRENT_ROUTE}/report`, async (req: any, res: any) => {
  try {
    const { quiz_id } = req.query
    const quizzes = await UserQuizController.getQuizzes(quiz_id)
    const mapped_quizzes = quizzes.map(item => item.dataValues)

    for (let i = 0; i < mapped_quizzes.length; i++) {
      const quiz = mapped_quizzes[i]
      const user = await UserController.getCodeByID(quiz.user_id);

      (quiz as any).username = user?.dataValues.name;
      (quiz as any).email = user?.dataValues.email;
      (quiz as any).code = user?.dataValues.code;
    }

    res.json({
      success: true,
      data: mapped_quizzes.sort(sortByTimeAndPoints)
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
