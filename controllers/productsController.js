const Filters = require("../modifiers/filters");
const db = require("../db/database");
const { useFilter, useSorter } = require("./modifiers");

//
//Допустимые название параметров (остальные не будут проверяться)
//* id продукта, text - текстовые поля продукта (название, описание), price - цена
const fieldsToCheck = ["id", "text", "price"];
// тут все поля уже дублируют названия колонок в
const allModelFields = ["id", "description", "title", "price"];
//
const MODEL_NAME = "products";
const FOREIGN_MODEL = "articles";
//
module.exports = {
  async getProductsHandler(req, res, next) {
    const query = req.query;

    let resultFilter = {};
    // Формируем фильтры
    resultFilter = await useFilter(query, fieldsToCheck, "description");
    // Формируем сортировки
    //todo: СОРТИРОВКИ СЮДА
    let orderObj = {};
    orderObj.order = await useSorter(query, allModelFields);
    //Запрос к бд делаем
    let rows = await db.get(MODEL_NAME, orderObj, {}, resultFilter);
    //К каждому продукту подбираем все статьи
    for (let i = 0; i < rows.length; i++) {
      let extRes = await db.get(
        FOREIGN_MODEL,
        {},
        {},
        { ProductId: rows[i].id }
      );
      rows[i] = { product: rows[i], articles: extRes };
    }
    //Отправляем полученные данные пользователю
    res.send(rows);
    return next();
  },
  async getOneProductHandler(req, res, next) {
    let id = req.params.id;
    let row = await db.get(MODEL_NAME, {}, {}, { id: id });
    res.send(row);
    next();
  },
  async createProductHandler(req, res, next) {
    try {
      await db.create(
        {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
        },
        MODEL_NAME
      );
      res.send(`item created`);
    } catch (err) {
      res.send(err.toString());
    }
    return next();
  },
  //Патчит один объект
  async updateProductHandler(req, res, next) {
    const body = req.body;
    let patched = {};
    try {
      for (let field in body) {
        if (allModelFields.includes(field)) {
          patched[field] = body[field];
        }
      }
      if (req.params.id) {
        await db.update(patched, MODEL_NAME, { id: req.params.id });
        res.send(`Updated product with id = ${req.params.id}`);
      } else {
        res.send(`Cannot update product with id = ${req.params.id}`);
      }
    } catch (err) {
      res.send(err.toString());
    }
    return next();
  },
  async deleteProductHandler(req, res, next) {
    try {
      await db.delete({ id: req.params.id }, MODEL_NAME);
    } catch (err) {
      res.send(err.toString());
    }
    res.send(`Deleted item with id = ${req.params.id}`);
    return next();
  },
};
