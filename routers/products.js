const Router = require("restify-router").Router;
const productsRouter = new Router();
const productsController = require("../controllers/productsController");
//
/* #region  Получение продуктов */
//Все продукты (можно фильтровать и сортировать)
productsRouter.get("/", productsController.getProductsHandler);
//Конкретную статью (нельзя фильтровать и сортировать)
productsRouter.get("/:id", productsController.getOneProductHandler);
/* #endregion */

//Создать новый продукт
productsRouter.post("/", productsController.createProductHandler);

//Обновить существующий продукт (по id)
productsRouter.patch("/:id", productsController.updateProductHandler);

//Удалить существующий продукт (по id)
productsRouter.del("/:id", productsController.deleteProductHandler); //
module.exports = productsRouter;
