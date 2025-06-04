import LectureViewsModel from './lecture-views.model'
import ScheduleModel from './schedule.model'
import {
  Table,
  Model,
  AutoIncrement,
  PrimaryKey,
  Column,
  ForeignKey,
  HasMany
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'


@Table({
  tableName: 'lectures',
  paranoid: false,
  timestamps: false
})
class Lecture extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  lecture_id: number

  @ForeignKey(() => ScheduleModel)
  @Column(DataTypes.INTEGER)
  schedule_id: number

  @Column(DataTypes.STRING)
  name: string

  @Column(DataTypes.STRING)
  city: string

  @Column(DataTypes.STRING)
  company: string

  @Column(DataTypes.DATE)
  start: string

  @Column(DataTypes.DATE)
  end: string

  @Column(DataTypes.STRING)
  fio: string

  @Column(DataTypes.BOOLEAN)
  is_votable: boolean

  @HasMany(() => LectureViewsModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  views: LectureViewsModel[]
}

export default Lecture
