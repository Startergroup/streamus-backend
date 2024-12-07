import type { Express, Router } from 'express'

export default (app: Express, routes: Router[], baseURL: string = '') => {
  routes.forEach((route) => {
    app.use(baseURL, route)
  })
}
