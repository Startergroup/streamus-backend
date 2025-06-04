import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'quiz',
  paranoid: false,
  timestamps: false
})
class QuizModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  override id: number

  @Column(DataTypes.INTEGER)
  quiz_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.INTEGER)
  points: number

  @Column(DataTypes.STRING)
  time: string
}

export default QuizModel
