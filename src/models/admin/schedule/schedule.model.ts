import LectureModel from './lecture.model'
import {
  AutoIncrement,
  Column,
  Table,
  PrimaryKey,
  Model,
  HasMany
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'schedules',
  paranoid: false,
  timestamps: false
})
class Schedule extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  schedule_id: number

  @Column(DataTypes.DATE)
  date: string

  @Column(DataTypes.INTEGER)
  section_id: number

  @Column(DataTypes.STRING)
  section_name: string

  @HasMany(() => LectureModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  lectures: LectureModel[]
}

export default Schedule
