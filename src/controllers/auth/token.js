import jwt from 'jsonwebtoken'

export default class tokenController {
  static async postToken(req, res) {
    const refreshToken = req.body.refresh_token
    if (!refreshToken) {
      res.status(401).send('No refresh token')
      return
    }

    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
      const token = jwt.sign(
        {
          name: user.name,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.EXPIRE_ACCESS_TOKEN }
      )
      if (!token) {
        return res.status(500).send('Unable to generate access token')
      }
      const response = {
        access_token: token,
        refresh_token: refreshToken,
      }
      res.status(201).send(response)
    } catch (err) {
      res.status(401).send('Unauthorized')
    }
  }
}
