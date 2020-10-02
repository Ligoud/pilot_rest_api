const Router = require("restify-router").Router;
const articlesRouter = new Router();
const articlesController = require("../controllers/articlesController");

/* #region  Получение статей */
//Все статьи (можно фильтровать и сортировать)
articlesRouter.get("/", articlesController.getArticlesHandler);
//Конкретную статью (нельзя фильтровать и сортировать)
articlesRouter.get("/:id", articlesController.getArticlesHandler);
/* #endregion */

//Создать новую статью
articlesRouter.post("/", articlesController.createArticleHandler);

//Обновить существующую статью (по id)
articlesRouter.patch("/:id", articlesController.updateArticleHandler);

//Удалить существующую статью (по id)
articlesRouter.del("/:id", articlesController.deleteArticleHandler);

//Экспортируем роутер настроенный
module.exports = articlesRouter;
