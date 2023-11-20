import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'tabs',
  paranoid: false,
  timestamps: false
})
class TabModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  tab_id: number

  @Column(DataTypes.STRING)
  name: string

  @Column(DataTypes.STRING)
  url: string

  @Column(DataTypes.INTEGER)
  order: number
}

export default TabModel
