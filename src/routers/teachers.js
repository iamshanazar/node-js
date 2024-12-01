import { Router } from "express";
import teachersController from "../controllers/teachers/teachers.js";
import { authenticate } from "./middleware.js";

export const teacheresRouter = Router()

teacheresRouter.get('/', authenticate,  teachersController.getTeachers)
teacheresRouter.get('/:id', authenticate,  teachersController.getOneTeachers)
teacheresRouter.put('/:id', authenticate,  teachersController.updateTeachers)
teacheresRouter.post('/',authenticate,  teachersController.createTeachers)
teacheresRouter.delete('/:id', authenticate,  teachersController.deleteTeachers)
