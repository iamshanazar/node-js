import { Router } from 'express'
import { authRouter } from './auth.js'
export const allRouter = Router()

allRouter.use('/', authRouter)