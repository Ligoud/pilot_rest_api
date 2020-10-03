const restify = require("restify");
const server = restify.createServer();
//
const db = require("./db/database");
//Синхронизируем при запуске приложения
db.synchronize();
//
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
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
