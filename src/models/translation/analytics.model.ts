import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import {DataTypes} from "sequelize";

@Table({
  tableName: 'analytics',
  paranoid: false,
  timestamps: false
})
class Analytics extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  override id: number

  @Column(DataTypes.INTEGER)
  tab_id: number

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.DATE)
  start_time: number

  @Column(DataTypes.DATE)
  end_time: number
}

export default Analytics
