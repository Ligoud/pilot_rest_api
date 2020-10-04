const Filters = require("../modifiers/filters");
const db = require("../db/database");

module.exports = {
  //Третий параметр определяет название колонки в таблице, описывающей продукт/статью (description, content)
  async useFilter(query, fieldsToCheck, textContentColumnName) {
    let resultFilter = {};

    //Перебираем все поля объекта параметров
    for (let field in query) {
      //Выбираем только валидные названия столбцов таблицы
      if (fieldsToCheck.includes(field)) {
        //
        //? У модели нет колонки text на самом деле
        //
        if (field === "text") {
          //text поле разбивается на два поля (типа поиск по ключевому слову)
          let orFilter = Filters.joinInOr(
            Filters.formFilter("like", "title", query[field]),
            Filters.formFilter("like", textContentColumnName, query[field])
          );
          //Если всё окей - добавляем фильтр
          if (orFilter !== undefined)
            resultFilter = { ...resultFilter, ...orFilter };
        } else {
          //Тут надо перебирать поля вложенного объекта (сами фильтры)
          for (let modifier in query[field]) {
            let newFilter = Filters.formFilter(
              modifier,
              field,
              query[field][modifier]
            );
            //Если всё окей - добавляем фильтр
            if (newFilter !== undefined) {
              resultFilter = { ...resultFilter, ...newFilter };
            }
          }
        }
      }
    }
    return resultFilter;
  },

  async useSorter({ sort }, allModelsFields) {
    const keywords = ["ASC", "DESC"];
    let sortArray = [];
    //Перебираем все типы сортировки
    for (let sortType in sort) {
      //Если тип валидный
      if (keywords.includes(sortType.toUpperCase())) {
        //Смотрим какие поля таблицы сортируются данным типом
        if (Array.isArray(sort[sortType])) {
          sort[sortType].forEach((el) => {
            if (allModelsFields.includes(el)) {
              sortArray.push([el, sortType.toUpperCase()]);
            }
          });
        } else {
          //Значит это строка (1 поле только)
          sortArray.push([sort[sortType], sortType.toUpperCase()]);
        }
      }
    }
    return sortArray;
  },
};
