import ChatModel from '@/models/admin/chat/chat.model'
import MessageModel from '@/models/admin/chat/message.model'
import UserModel from '@/models/admin/user.model'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

class ChatController {
  public async createChat (tab_id: number) {
    try {
      if (!tab_id) {
        return {
          success: false,
          message: 'Tab_id is required'
        }
      }

      await ChatModel.create({
        tab_id,
        date: dayjs().tz('Europe/Moscow') as unknown as Date
      } as ChatModel)

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  public async createMessage ({ chat_id, text, user_id }: { chat_id: number; text: string, user_id: number }) {
    try {
      if (!(chat_id && text && user_id)) return

      await MessageModel.create({
        chat_id,
        sender_id: user_id,
        text,
        timestamp: dayjs().tz('Europe/Moscow').valueOf()
      })
    } catch (error) {
      throw error
    }
  }

  public async deleteMessage ({ chat_id, uuid }: { chat_id: number; uuid: number }) {
    try {
      const message = await MessageModel.findOne({
        where: {
          chat_id,
          uuid
        }
      })
      await message?.destroy()

      return await this.getMessagesByChatID(chat_id)
    } catch (error) {
      throw error
    }
  }

  public async getChats () {
    try {
      return await ChatModel.findAll()
    } catch (error) {
      throw error
    }
  }

  public async getChatByTabID (tab_id: number) {
    try {
      return ChatModel.findOne({
        where: {
          tab_id
        },
        include: [
          {
            model: MessageModel,
            include: [{
              model: UserModel,
              attributes: ['name']
            }]
          }
        ]
      })
    } catch (error) {
      throw error
    }
  }

  public async getMessagesByChatID (chat_id: number) {
    try {
      return MessageModel.findAll({
        where: {
          chat_id
        },
        include: {
          model: UserModel,
          attributes: ['name']
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default new ChatController()
