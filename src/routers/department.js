import { authenticate } from "./middleware.js";

import { Router } from "express";
import departmentController from "../controllers/departments/department.js";

export const departmentRouter = Router()

departmentRouter.get('/',  departmentController.getDepartment)
departmentRouter.get('/:id',  departmentController.getOneDepartment)
departmentRouter.post('/',  departmentController.createDepartment)
departmentRouter.put('/:id',  departmentController.updateDepartment)
departmentRouter.delete('/:id',  departmentController.deleteDepartment)