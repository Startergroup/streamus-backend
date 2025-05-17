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

import Question from './question.model'

@Table({
  tableName: 'answers',
  paranoid: false,
  timestamps: false
})
class Answers extends Model {
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

  @ForeignKey(() => Question)
  @Column(DataTypes.INTEGER)
  question_id: number

  @BelongsTo(() => Question)
  question: Question
}

export default Answers
