import { Router } from 'express'
import { authRouter } from './auth.js'
import { facultiesRouter } from './faculties.js'
import { departmentRouter } from './department.js'
import { teacheresRouter } from './teachers.js'
import { articleRouter } from './articles.js'
import { itemsRouter } from './items.js'
export const allRouter = Router()


allRouter.use('/', authRouter)
allRouter.use('/faculties', facultiesRouter)
allRouter.use('/departments', departmentRouter)
allRouter.use('/teachers', teacheresRouter)
allRouter.use('/articles', articleRouter)
allRouter.use('/items', itemsRouter)