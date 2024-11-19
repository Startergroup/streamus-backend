import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'


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
  lecture_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.INTEGER)
  schedule_id: number
}

export default VoteModel
