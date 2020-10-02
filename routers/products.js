const Router = require("restify-router").Router;
const productsRouter = new Router();
const productsController = require("../controllers/productsController");
//
/* #region  Получение статей */
//Все статьи (можно фильтровать и сортировать)
productsRouter.get("/", productsController.getProductsHandler);
//Конкретную статью (нельзя фильтровать и сортировать)
productsRouter.get("/:id", productsController.getProductsHandler);
/* #endregion */

//Создать новую статью
productsRouter.post("/", productsController.createProductHandler);

//Обновить существующую статью (по id)
productsRouter.patch("/:id", productsController.updateProductHandler);

//Удалить существующую статью (по id)
productsRouter.del("/:id", productsController.deleteProductHandler); //
module.exports = productsRouter;
