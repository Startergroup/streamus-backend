// Admin auth
import Auth from './admin/auth'
// Quiz routes
import Quiz from './quiz/quiz'
import QuizAnswer from './quiz/answer'
import QuizQuestion from './quiz/question'
// Translation routes
import TranslationSettings from './translation/settings'
import TranslationTabs from './translation/tab'
import TranslationUsers from './translation/user'
// User routes
import UserAuth from './user/auth'
import UserQuiz from './user/quiz'
import UserVote from './user/vote'
// Other routes
import File from './file'
import Presentation from './presentation'
import Vote from './vote'

export default [
  Auth,
  File,
  Quiz,
  QuizAnswer,
  QuizQuestion,
  Presentation,
  TranslationSettings,
  TranslationTabs,
  TranslationUsers,
  UserAuth,
  UserQuiz,
  UserVote,
  Vote
]
