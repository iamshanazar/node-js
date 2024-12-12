import { execute } from '../../../database/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// import { env } from '../../../config/config.js'

export default class authController {

  static async createSignUp(req, res) {
    const { name,  password, type } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
      
    try {
      const { rows } = await execute('INSERT INTO users (name,password,type) VALUES($1,$2,$3)', [
        name,
        hashedPassword,
        type
      ])
     return res.status(201).json({
        message: `${rows[0].id} Has been succesfully registred`,
        status: true,
      })
    } catch (err) {
       return res.status(500).json({
        message: 'User already exist',
        status: false,
      })
    }
  }

  static async createSignIn(req, res) {
    const { name, password  } = req.body
    try {
      const { rows } = await execute('SELECT * FROM users WHERE name =$1', [name])
      const user = rows[0]
      if (!user) {
      return  res.status(400).json({
          error: 'User is not registered, Sign Up first or enter correct password',
        })
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
           return res.status(500).json({
              error: 'Server error',
            })
          } else if (result === true) {
            const token = jwt.sign(
              {
                name: user.name,
              },
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.EXPIRE_ACCESS_TOKEN }
            )
            const refreshToken = jwt.sign(
              {
                name: user.name,
              },
              process.env.REFRESH_TOKEN_SECRET_KEY,
              { expiresIn: process.env.EXPIRE_REFRESH_TOKEN }
            )
           return  res.status(200).json({
              message: 'User signed in!',
              access_token: token,
              refresh_token: refreshToken,
              type: user.type
            })
          } else {
            if (result !== true) {
              res.status(400).json({
                error: 'Enter correct password!',
              })
            }
          }
        })
      }
    } catch (err) {
     return  res.status(500).json({
        error: err,
      })
    }
  }
}
