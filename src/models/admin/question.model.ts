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

import Quiz from './quiz.model'
import Answers from './answers.model'

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

  @ForeignKey(() => Quiz)
  @Column(DataTypes.INTEGER)
  quiz_id: number

  @BelongsTo(() => Quiz)
  quiz: Quiz

  @Column(DataTypes.BOOLEAN)
  free_answer: boolean

  @HasMany(() => Answers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  answers: Answers[]
}

export default Question
