import { authenticate } from "./middleware.js";

import { Router } from "express";
import departmentController from "../controllers/departments/department.js";

export const departmentRouter = Router()

departmentRouter.get('/', authenticate, departmentController.getDepartment)
departmentRouter.get('/:id', authenticate, departmentController.getOneDepartment)
departmentRouter.post('/', authenticate, departmentController.createDepartment)
departmentRouter.put('/:id', authenticate, departmentController.updateDepartment)
departmentRouter.delete('/:id', authenticate, departmentController.deleteDepartment)