// import { authenticate } from "./middleware.js";

import { Router } from "express";

import articleController from "../controllers/articles/article.js";

export const articleRouter = Router()


articleRouter.get('/',  articleController.getArticle)
articleRouter.get('/:id', articleController.getOneArticles)
articleRouter.post('/',  articleController.createArticles)
articleRouter.put('/:id',  articleController.updateArticles)
articleRouter.delete('/:id',  articleController.deleteArticles)