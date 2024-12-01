// import { authenticate } from "./middleware.js";

import { Router } from "express";

import { authenticate } from "./middleware.js";

import articleController from "../controllers/articles/article.js";

export const articleRouter = Router()


articleRouter.get('/', authenticate,   articleController.getArticles)
articleRouter.get('/:id', authenticate,  articleController.getArticles)
articleRouter.post('/', authenticate,  articleController.createArticle)
articleRouter.put('/:id', authenticate,  articleController.updateArticle)
articleRouter.delete('/:id', authenticate,  articleController.deleteArticle)