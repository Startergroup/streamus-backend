import {
  AutoIncrement, BelongsTo,
  Column, ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import VoteModel from './vote.model'

@Table({
  tableName: 'presentations',
  paranoid: false,
  timestamps: false
})
class PresentationsModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  presentation_id: number

  @Column(DataTypes.STRING)
  name: string

  @ForeignKey(() => VoteModel)
  @Column(DataTypes.INTEGER)
  vote_id: number

  @BelongsTo(() => VoteModel)
  vote: VoteModel
}

export default PresentationsModel
