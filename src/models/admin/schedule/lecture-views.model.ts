import LectureModel from './lecture.model'
import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'lecture-views',
  paranoid: false,
  timestamps: false
})
class LectureViews extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  override id: number

  @ForeignKey(() => LectureModel)
  @Column(DataTypes.INTEGER)
  lecture_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.DATE)
  start: Date

  @Column(DataTypes.DATE)
  end: Date
}

export default LectureViews
