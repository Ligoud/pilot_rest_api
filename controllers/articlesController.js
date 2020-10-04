const Filters = require("../modifiers/filters");
const db = require("../db/database");
const { useFilter, useSorter } = require("./modifiers");

//
//Допустимые название параметров (остальные не будут проверяться)
//* id продукта, text - текстовые поля продукта (название, контент), date - дата
const fieldsToCheck = ["id", "text", "date", "ProductId"];
// тут все поля уже дублируют названия колонок в
const allModelFields = ["id", "content", "title", "date", "ProductId"];
//
const MODEL_NAME = "articles";
const FOREIGN_MODEL = "products";
//
//Update date
function formDateByString(str) {
  return new Date(
    str
      .split(".")
      .map((el) => +el)
      .reverse()
  );
}
//
module.exports = {
  async getArticlesHandler(req, res, next) {
    //Модифицируем дату, чтобы она была в унифицированном виде
    if (req.query.date) {
      for (let dateModifier in req.query.date) {
        req.query.date[dateModifier] = formDateByString(
          req.query.date[dateModifier]
        );
      }
    }
    const query = req.query;

    let resultFilter = {};
    // Формируем фильтры
    resultFilter = await useFilter(query, fieldsToCheck, "content");
    // Формируем сортировки
    let orderObj = {};
    orderObj.order = await useSorter(query, allModelFields);
    //Запрос к бд делаем
    let rows = await db.get(MODEL_NAME, orderObj, resultFilter);
    //К каждой статье подбираем описание товара
    for (let i = 0; i < rows.length; i++) {
      let extRes = await db.get(
        FOREIGN_MODEL,
        {},
        {},
        { id: rows[i].ProductId }
      );
      rows[i] = { article: rows[i], product: extRes };
    }
    //Отправляем полученные данные пользователю
    res.send(rows);
    return next();
  },
  async getOneArticleHandler(req, res, next) {
    let id = req.params.id;
    let row = await db.get(MODEL_NAME, {}, {}, { id: id });
    res.send(row);
    next();
  },
  async createArticleHandler(req, res, next) {
    try {
      await db.create(
        {
          title: req.body.title,
          content: req.body.content,
          date: formDateByString(req.body.date),
          ProductId: req.body.ProductId,
        },
        MODEL_NAME
      );
      res.send(`Article created`);
    } catch (err) {
      res.send(err.toString());
    }
    return next();
  },
  //Патчит один объект
  async updateArticleHandler(req, res, next) {
    let body = req.body;
    let patched = {};
    try {
      for (let field in body) {
        if (allModelFields.includes(field)) {
          console.log(field);
          if (field === "date") {
            body[field] = formDateByString(body[field]);
          }
          patched[field] = body[field];
        }
      }
      if (req.params.id) {
        await db.update(patched, MODEL_NAME, { id: req.params.id });
        res.send(`Updated article with id = ${req.params.id}`);
      } else {
        res.send(`Cannot update article with id = ${req.params.id}`);
      }
    } catch (err) {
      res.send(err.toString());
    }
    return next();
  },
  async deleteArticleHandler(req, res, next) {
    try {
      await db.delete({ id: req.params.id }, MODEL_NAME);
    } catch (err) {
      res.send(err.toString());
    }
    res.send(`Deleted article with id = ${req.params.id}`);
    return next();
  },
};
