import ChatModel from './chat.model'
import UserModel from '../user.model'
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

@Table({
  indexes: [
    {
      name: 'messages_chat_id_idx',
      fields: ['chat_id'] // Индекс для поиска по секциям
    },
    {
      name: 'messages_sender_id_idx',
      fields: ['sender_id'] // Индекс для поиска по отправителю
    },
    {
      name: 'messages_created_at_idx',
      fields: ['timestamp']
    }
  ],
  tableName: 'messages',
  paranoid: false,
  timestamps: false,
  updatedAt: false
})
class Message extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataTypes.UUID)
  uuid: number

  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  @ForeignKey(() => UserModel)
  sender_id: number

  @BelongsTo(() => UserModel)
  sender: UserModel

  @AllowNull(false)
  @ForeignKey(() => ChatModel)
  @Index('messages_chat_id_idx') // Дублируем индекс из @Table
  @Column(DataTypes.INTEGER)
  chat_id: number

  @AllowNull(false)
  @Column(DataTypes.STRING(800))
  text: string

  @AllowNull(false)
  @Default(() => DataTypes.NOW)
  @Column(DataTypes.DATE)
  timestamp?: Date
}

export default Message
