type answer = {
  id: number,
  user_id: number,
  question_id: number,
  answer_id: number,
  value?: string|number
}

type quiz = {
  id?: number,
  time: number,
  quiz_id: number,
  user_id: number,
  points?: number,
  answers?: answer[]
}

type vote = {
  vote_id?: number,
  user_id: number,
  lecture_id: number,
  schedule_id: number
}

type analytics = {
  tab_id: number,
  user_id: number,
  start_time: number,
  end_time?: number,
  duration?: number
}

export {
  analytics,
  answer,
  quiz,
  vote
}
