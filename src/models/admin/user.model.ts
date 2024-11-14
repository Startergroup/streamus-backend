import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'users',
  paranoid: false,
  timestamps: false
})
class UserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  code_id: number

  @Column(DataTypes.STRING)
  code: string

  @Column(DataTypes.STRING)
  name: string

  @Column(DataTypes.STRING)
  email: string

  @Column(DataTypes.STRING)
  access_token: string

  @Column(DataTypes.BOOLEAN)
  isGuest: boolean

  @Column(DataTypes.DATE)
  last_activity: Date
}

export default UserModel
