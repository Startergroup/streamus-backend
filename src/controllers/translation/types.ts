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
  id?: number,
  user_id: number,
  presentation_id: number,
  like?: boolean | null
}

export {
  answer,
  quiz,
  vote
}
