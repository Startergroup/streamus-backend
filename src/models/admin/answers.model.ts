import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

import QuestionModel from './question.model'

@Table({
  tableName: 'answers',
  paranoid: false,
  timestamps: false
})
class AnswersModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  answer_id: number

  @Column(DataTypes.STRING)
  content: string

  @Column(DataTypes.BOOLEAN)
  is_right: boolean

  @Column(DataTypes.STRING)
  img: string

  @Column(DataTypes.BOOLEAN)
  is_free_answer: boolean

  @ForeignKey(() => QuestionModel)
  @Column(DataTypes.INTEGER)
  question_id: number

  @BelongsTo(() => QuestionModel)
  question: QuestionModel
}

export default AnswersModel
