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

itemsRouter.get('/',  itemsController.getItems)
itemsRouter.get('/:id',  itemsController.getOneItems)
itemsRouter.post('/',  upload.single('file'), itemsController.createItems)
itemsRouter.put('/:id', upload.single('file'), itemsController.updateItems)
itemsRouter.delete('/:id',  itemsController.deleteItems)

