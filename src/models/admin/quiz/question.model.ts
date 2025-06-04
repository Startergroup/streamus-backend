import AnswersModel from './answer.model'
import QuizModel from './quiz.model'
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

@Table({
  tableName: 'questions',
  paranoid: false,
  timestamps: false
})
class Question extends Model {
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

  @Column(DataTypes.BOOLEAN)
  free_answer: boolean

  @HasMany(() => AnswersModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  answers: AnswersModel[]
}

export default Question
