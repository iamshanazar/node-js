import { Router } from "express";
import facultiesController from "../controllers/faculties/faculties.js";
import { authenticate } from "./middleware.js";
export const facultiesRouter = Router()

facultiesRouter.get('/', authenticate, facultiesController.getFaculties)
facultiesRouter.post('/', authenticate, facultiesController.createFaculties)
facultiesRouter.get('/:id', authenticate, facultiesController.getOneFaculties)
facultiesRouter.put('/:id', authenticate,facultiesController.updateFaculties)
facultiesRouter.delete('/:id', authenticate, facultiesController.deleteFaculties)