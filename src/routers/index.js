import { Router } from 'express'
import { authRouter } from './auth.js'
import { facultiesRouter } from './faculties.js'
import { departmentRouter } from './department.js'
import { teacheresRouter } from './teachers.js'

export const allRouter = Router()


allRouter.use('/', authRouter)
allRouter.use('/', facultiesRouter)
allRouter.use('/departments', departmentRouter)
allRouter.use('/teachers', teacheresRouter)