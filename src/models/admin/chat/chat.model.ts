import MessageModel from './message.model'
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({
  tableName: 'chats',
  paranoid: false,
  timestamps: false,
  updatedAt: false
})
class Chat extends Model<Chat> {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  override id: number

  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  tab_id: number

  @AllowNull(false)
  @Default(() => DataTypes.NOW)
  @Column(DataTypes.DATE)
  date?: Date

  @AllowNull(false)
  @Default(() => false)
  @Column(DataTypes.BOOLEAN)
  active?: boolean

  @HasMany(() => MessageModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
  })
  messages: MessageModel[]
}

export default Chat
