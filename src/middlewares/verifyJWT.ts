import jwt from 'jsonwebtoken'

const verifyJWT = (secret:string) => {
  return (req:any, res:any, next:Function) => {
    try {
      const auth_header = req.headers.authorization

      if (auth_header) {
        const token = auth_header.split(' ')[1]
        const is_valid = jwt.verify(token, secret)

        if (is_valid) {
          return next()
        } else {
          return res.status(403).json({
            expired: true,
            message: 'Token is expired'
          })
        }
      } else {
        res.sendStatus(403)
      }
    } catch (error) {
      res.sendStatus(403)
    }
  }
}

module.exports = verifyJWT
