const restify = require("restify");
const server = restify.createServer();
server.use(restify.plugins.queryParser());
//Все кастомные роутеры
const productsRouter = require("./routers/products");
const articlesRouter = require("./routers/articles");
//
//Прикрепляем кастомные роутеры к серверу
productsRouter.applyRoutes(server, "/products");
articlesRouter.applyRoutes(server, "/articles");

//Поднимаем сервер
server.listen(4444, () => {
  console.log("Server started");
});
