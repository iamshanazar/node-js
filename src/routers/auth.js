import { Router } from 'express'
import authController from '../controllers/auth/auth.js'
import tokenController from '../controllers/auth/token.js'
export const authRouter = Router()

authRouter.post('/register', authController.createSignUp)
authRouter.post('/login', authController.createSignIn)
authRouter.post('/token', tokenController.postToken)
