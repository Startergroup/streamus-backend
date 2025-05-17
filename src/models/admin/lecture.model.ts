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

import LectureViews from './lecture-views.model'
import Schedule from './schedule.model'


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

  @ForeignKey(() => Schedule)
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

  @HasMany(() => LectureViews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  views: LectureViews[]
}

export default Lecture
