import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import TabModel from './tab.model'

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

  @ForeignKey(() => TabModel)
  @Column(DataTypes.INTEGER)
  tab_id: number

  @BelongsTo(() => TabModel) // Простая ассоциация
  tab: TabModel // Это будет экземпляр TabModel

  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.DATE)
  start_time: Date

  @Column(DataTypes.DATE)
  end_time: Date
}

export default Analytics
