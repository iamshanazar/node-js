import { Router } from 'express'
import { authRouter } from './auth.js'
import { facultiesRouter } from './faculties.js'
export const allRouter = Router()


allRouter.use('/', authRouter)
allRouter.use('/faculties', facultiesRouter)
