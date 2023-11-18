import { Router } from 'express'
import { authRouter } from './auth.js'
import { facultiesRouter } from './faculties.js'
import { departmentRouter } from './department.js'

export const allRouter = Router()


allRouter.use('/', authRouter)
allRouter.use('/', facultiesRouter)
allRouter.use('/departments', departmentRouter)