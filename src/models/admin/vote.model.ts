import {
  AutoIncrement,
  Column, HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import PresentationsModel from './presentations.model'


@Table({
  tableName: 'votes',
  paranoid: false,
  timestamps: false
})
class VoteModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  vote_id: number

  @Column(DataTypes.INTEGER)
  tab_id: number

  @Column(DataTypes.STRING)
  tab_name: string

  @HasMany(() => PresentationsModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  presentations: PresentationsModel[]
}

export default VoteModel
