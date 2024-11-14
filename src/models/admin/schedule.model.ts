import {
  AutoIncrement,
  Column,
  Table,
  PrimaryKey,
  Model,
  HasMany
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

import LectureModel from './lecture.model'

@Table({
  tableName: 'schedules',
  paranoid: false,
  timestamps: false
})
class ScheduleModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  schedule_id: number

  @Column(DataTypes.INTEGER)
  date: number

  @HasMany(() => LectureModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  lectures: LectureModel[]
}

export default ScheduleModel
