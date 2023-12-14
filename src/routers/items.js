import multer from "multer";
import { Router } from "express";

export const itemsRouter = Router();

import itemsController from "../controllers/items/item.js";
import { authenticate } from "./middleware.js";

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

itemsRouter.get('/', authenticate, itemsController.getItems)
itemsRouter.get('/:id', authenticate, itemsController.getOneItems)
itemsRouter.post('/', authenticate, upload.single('file'), itemsController.createItems)
itemsRouter.put('/:id', authenticate,upload.single('file'), itemsController.updateItems)
itemsRouter.delete('/:id', authenticate, itemsController.deleteItems)

