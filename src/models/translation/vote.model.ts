import {AutoIncrement, Column, Model, PrimaryKey, Table} from 'sequelize-typescript'
import {DataTypes} from "sequelize";

@Table({
  tableName: 'votes',
  paranoid: false,
  timestamps: false
})
class VoteModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  override id: number

  @Column(DataTypes.INTEGER)
  presentation_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.BOOLEAN)
  like: boolean
}

export default VoteModel
