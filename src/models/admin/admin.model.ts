import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'admin',
  paranoid: false,
  timestamps: false
})
class AdminModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  user_id: number

  @Column(DataTypes.STRING)
  login: string

  @Column(DataTypes.STRING)
  pass_hash: string

  @Column(DataTypes.STRING)
  salt: string
}

export default AdminModel
