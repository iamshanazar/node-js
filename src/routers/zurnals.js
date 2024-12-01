
import { Router } from "express";

import { authenticate } from "./middleware.js";

import ZurnalController from "../controllers/zurnals/zurnal.js";

export const zurnalRouter = Router()

zurnalRouter.get('/', authenticate, ZurnalController.getZurnals)
zurnalRouter.get('/:id', authenticate, ZurnalController.getOneZurnal)
zurnalRouter.post('/', authenticate, ZurnalController.createZurnal)
zurnalRouter.put('/:id', authenticate, ZurnalController.updateZurnal)
zurnalRouter.delete('/:id', authenticate, ZurnalController.deleteZurnal)

