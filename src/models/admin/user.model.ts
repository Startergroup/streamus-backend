import MessageModel from '@/models/admin/chat/message.model'
import {
  AutoIncrement,
  Column,
  HasMany,
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
class User extends Model {
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

  @Column(DataTypes.DATE)
  last_activity: Date

  @HasMany(() => MessageModel, 'sender_id')
  messages?: []
}

export default User
