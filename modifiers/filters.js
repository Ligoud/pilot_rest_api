const { Op } = require("sequelize");
//
//Допустимые ключевые слова фильтров
_filterList = ["eq", "ne", "lt", "gt", "lte", "gte"];
//
class Filters {
  //Проверка, является ли ключевое слово допустимым
  static checkKeyword(filterWord) {
    let res = false;
    if (_filterList.includes(filterWord)) res = true;
    return res;
  }

  //
  //Дальше идут методы, возвращающие объекты с фильтрами,
  //подходящими для ORM sequelize
  //

  //Формируем фильтр. keyword - название фильтра. value - значение
  static formFilter(keyWord, field, value) {
    if (this.checkKeyword(keyWord)) {
      return {
        [field]: {
          [Op[keyWord]]: value,
        },
      };
    } else if (keyWord === "like") {
      //Отдельно рассматриваем like
      return {
        [field]: {
          //Регистрозависимое вхождение. Для sqlite нет в этой ORM регистронезависимого
          [Op.like]: `%${value}%`,
        },
      };
    } else {
      return undefined;
    }
  }

  //Соединяем в ИЛИ фильтр. На вход ДОЛЖЕН получать массив фильтров (объектов)
  static joinInOr(...conditionsArray) {
    if (conditionsArray.length > 1) {
      let connectedFilters = [];
      conditionsArray.forEach((el) => {
        if (typeof el === "object") {
          connectedFilters.push(el);
        } else {
          return undefined;
        }
      });
      //Возвращаем новый фильтр
      return { [Op.or]: connectedFilters };
    } else {
      return undefined;
    }
  }
}

module.exports = Filters;
