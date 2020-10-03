const { Sequelize } = require("sequelize");
const { resolve } = require("path");
const { Products, Articles } = require("./models");
const models = require("./models");
//

class Database {
  constructor() {
    //Конектимся к базе данных
    this.seq = new Sequelize({
      dialect: "sqlite",
      storage: resolve(__dirname, "db.sqlite"),
      logging: false,
      define: {
        timestamps: false,
      },
    });
    //Создаем модели
    this.ProductsModel = this.seq.define("Product", Products);
    this.ArticlesModel = this.seq.define("Article", Articles);
    //Зависимость устанавливаем
    this.ProductsModel.hasMany(this.ArticlesModel, { as: "product" });
    //
  }
  //Синхронизируем, в случае, если бд только создалась
  async synchronize() {
    try {
      await this.seq.sync();
    } catch (err) {
      console.log(err);
    }
  }
  //Получаем модель по строке
  getCurrentModel(name) {
    let model = {};
    if (name === "products") {
      model = this.ProductsModel;
    } else if (name === "articles") {
      model = this.ArticlesModel;
    } else {
      throw new Error(`No valid models detected (${name})`);
    }
    return model;
  }
  //Получаем существующие строки. modifier - фильтры и сортировки
  async get(modelName, modifier, conditionQuery = {}) {
    let model = this.getCurrentModel(modelName);
    let result = await model.findAll({
      where: { ...conditionQuery, ...modifier },
      raw: true,
    });
    return result;
  }
  //Создает новую строку в бд
  async create(newObject, modelName) {
    let model = this.getCurrentModel(modelName);
    await model.create(newObject);
  }
  //Обновляет существующую строку в объекте
  async update(patchedObject, modelName, conditionQuery = {}) {
    let model = this.getCurrentModel(modelName);
    await model.update(patchedObject, { where: conditionQuery });
  }
  //Удаляет существующую строку в объекте
  async delete(conditionQuery, modelName) {
    let model = this.getCurrentModel(modelName);
    await model.destroy({ where: conditionQuery });
  }
}

//
async function start() {
  let db = new Database();
  await db.synchronize();
  await db.create(
    { title: "title3", description: "desc3", price: 5500 },
    "products"
  );
}

// start();
//Экспортирую экземлпяр
module.exports = new Database();
