import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'lecture-report',
  paranoid: false,
  timestamps: false
})
class LectureReportModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  override id: number

  @Column(DataTypes.INTEGER)
  lecture_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.DATE)
  start_time: Date

  @Column(DataTypes.DATE)
  end_time: Date
}

export default LectureReportModel
