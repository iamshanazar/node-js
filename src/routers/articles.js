import { authenticate } from "./middleware.js";

import { Router } from "express";

import articleController from "../controllers/articles/article.js";

export const articleRouter = Router()


articleRouter.get('/', authenticate, articleController.getArticle)
articleRouter.get('/:id', authenticate, articleController.getOneArticles)
articleRouter.post('/', authenticate, articleController.createArticles)
articleRouter.put('/:id', authenticate, articleController.updateArticles)
articleRouter.delete('/:id', authenticate, articleController.deleteArticles)