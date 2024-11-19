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

export {
  answer,
  quiz,
  vote
}
