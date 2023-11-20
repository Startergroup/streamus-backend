type quiz = {
  name: string,
  quiz_id?: number,
  introduction_text: string,
  duration: number,
  logo: string,
  background: string
}

type question = {
  question_id?: number | null,
  quiz_id?: number | null
  content: string,
  img?: string | null,
  answers: answer[]
}

type answer = {
  answer_id?: number | null,
  question_id?: number,
  content: string,
  img?: string | null,
  is_right: boolean
}

type admin = {
  user_id?: number,
  login: string,
  pass_hash?: string,
  salt?: string
}

type tab = {
  tab_id?: number,
  name: string,
  url: string,
  order: number
}

type code = {
  code_id?: number,
  code?: string,
  name?: string,
  email?: string,
  last_activity?: number | null,
  refresh_token?: string | null
}

type settings = {
  settings_id: number,
  title_ru?: string | null,
  subtitle_ru?: string | null,
  title_en?: string | null,
  subtitle_en?: string | null,
  favicon?: string | null
}

type vote = {
  vote_id?: number,
  tab_id?: number,
  tab_name: string,
  presentations?: []
}

type presentation = {
  presentation_id?: number,
  name: string,
  vote_id?: number
}

export {
  admin,
  answer,
  code,
  quiz,
  question,
  presentation,
  settings,
  tab,
  vote
}
