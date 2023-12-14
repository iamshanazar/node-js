import { Router } from "express";
import facultiesController from "../controllers/faculties/faculties.js";
import { authenticate } from "./middleware.js";

export const facultiesRouter = Router()

facultiesRouter.get('/', authenticate, facultiesController.getFaculties)
facultiesRouter.get('/:id', authenticate, facultiesController.getOneFaculties)
facultiesRouter.post('/', authenticate, facultiesController.createFaculties)
facultiesRouter.put('/:id', authenticate,facultiesController.updateFaculties)
facultiesRouter.delete('/:id', authenticate, facultiesController.deleteFaculties)