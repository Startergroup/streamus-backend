import ChatController from '@/controllers/admin/chat/chat.controller'
import ExpressWS from 'express-ws'
import { Router, Request, Response } from 'express'
import { ROUTES_VERSION } from '@/constants'

const router = Router()
const wsRouter = ExpressWS(router as any)
const WSConnections = new Set<any>()

// const WSConnections = new Set()

router.get(`/api/${ROUTES_VERSION}/chats`, async (_req: Request, res: Response) => {
  try {
    const chats = await ChatController.getChats()

    return res.json({
      success: true,
      data: {
        chats
      }
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(`/api/${ROUTES_VERSION}/chat/message`, async (req: Request, res: Response) => {
  try {
    const { chat_id, uuid } = req.body
    const messages = await ChatController.deleteMessage({ chat_id, uuid })

    WSConnections.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(messages))
      } else {
        // Удаляем неактивные подключения
        WSConnections.delete(client)
      }
    })

    return res.json({
      success: true,
      message: 'ok'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

wsRouter.app.ws(`/api/${ROUTES_VERSION}/chat/message`, async (ws, _req: Request) => {
  try {
    WSConnections.add(ws)
    console.log('Новое подключение. Всего клиентов:', WSConnections.size)

    ws.on('message', async (message) => {
      const {
        chat_id,
        init,
        tab_id = null,
        text = '',
        user_id = null
      } = JSON.parse(message as unknown as string) || {}

      if (init) {
        const chat = await ChatController.getChatByTabID(tab_id)
        const payload = {
          ...chat?.dataValues,
          init: true
        }

        return ws.send(JSON.stringify(payload))
      }

      await ChatController.createMessage({
        chat_id,
        text,
        user_id
      })

      const messages = await ChatController.getMessagesByChatID(chat_id)
      // Рассылаем всем активным клиентам
      WSConnections.forEach(client => {
        console.debug(client)
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(messages))
        } else {
          // Удаляем неактивные подключения
          WSConnections.delete(client)
        }
      })
    })

    ws.on('close', () => {
      WSConnections.delete(ws)
      console.debug('Клиент отключился')
    })
  } catch (error) {
    console.debug(error)
  }
})

export default router
