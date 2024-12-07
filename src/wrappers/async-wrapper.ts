import type { Response, Request } from 'express'

type AsyncRouterHandler = (req: Request, res: Response) => Promise<void>

export default (fn: AsyncRouterHandler) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await fn(req, res)
    } catch (error: unknown) {
      const message = error instanceof Error ? error?.message : error

      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? undefined : message,
        message: 'Непредвиденная ошибка при выполнении запроса'
      })
    }
  }
}
