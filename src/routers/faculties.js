import { Router } from "express";
import facultiesController from "../controllers/faculties/faculties.js";
import { authenticate } from "./middleware.js";

export const facultiesRouter = Router()

facultiesRouter.get('/',  facultiesController.getFaculties)
facultiesRouter.get('/:id',  facultiesController.getOneFaculties)
facultiesRouter.post('/',  facultiesController.createFaculties)
facultiesRouter.put('/:id', facultiesController.updateFaculties)
facultiesRouter.delete('/:id',  facultiesController.deleteFaculties)