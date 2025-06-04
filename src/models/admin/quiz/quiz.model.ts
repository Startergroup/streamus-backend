import QuestionModel from './question.model'
import {
  Table,
  Model,
  AutoIncrement,
  PrimaryKey,
  Column,
  HasMany
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'quizzes',
  paranoid: false,
  timestamps: false
})
class Quiz extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  quiz_id: number

  @Column(DataTypes.STRING)
  name: string

  @Column(DataTypes.BOOLEAN)
  is_active: boolean

  @Column(DataTypes.STRING)
  introduction_text: string

  @Column(DataTypes.STRING)
  duration: string

  @Column(DataTypes.STRING)
  logo: string

  @Column(DataTypes.STRING)
  background: string

  @HasMany(() => QuestionModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  questions: QuestionModel[]
}

export default Quiz
