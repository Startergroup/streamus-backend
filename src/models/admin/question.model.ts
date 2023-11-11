import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

import QuizModel from './quiz.model'
import AnswersModel from './answers.model'

@Table({
  tableName: 'questions',
  paranoid: false,
  timestamps: false
})
class QuestionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  question_id: number

  @Column(DataTypes.STRING)
  content: string

  @Column(DataTypes.STRING)
  img: string

  @ForeignKey(() => QuizModel)
  @Column(DataTypes.INTEGER)
  quiz_id: number

  @BelongsTo(() => QuizModel)
  quiz: QuizModel

  @HasMany(() => AnswersModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  answers: AnswersModel[]
}

export default QuestionModel
