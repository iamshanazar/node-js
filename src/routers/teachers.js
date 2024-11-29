import { Router } from "express";
import teachersController from "../controllers/teachers/teachers.js";
import { authenticate } from "./middleware.js";

export const teacheresRouter = Router()

teacheresRouter.get('/',  teachersController.getTeachers)
teacheresRouter.get('/:id',  teachersController.getOneTeachers)
teacheresRouter.put('/:id',  teachersController.updateTeachers)
teacheresRouter.post('/',  teachersController.createTeachers)
teacheresRouter.delete('/',  teachersController.deleteTeachers)
