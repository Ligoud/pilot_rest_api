# Rest api for pilot test task

Проект является реализацией rest api и выполнен в качестве тествого задания.

Для запуска проекта необходимо:
- Склонировать проект с репозитория `git clone https://github.com/Ligoud/pilot_rest_api pilot_rest`\
- Выполнить команду `npm install`
- Запустить проект `npm start`

---
Тестирование api осуществляется посредством postman. 

Базовый тестовый пресет хранится в JSON файле 'pilot_test_task.postman_collection.json'

---
### Описание моделей в базе данных
**Модель Products**
`
{
  id,
  title,
  description,
  price
}
`
**Модель Articles**
`
{
  id,
  title,
  content,
  date,
  ProductId
}
`
---
### Описание форматов параметров

- **Для фильтрации**
`<Название поля в таблице>[<filer>]`
, где <filter> - одно из значений для фильтрации:
  - eq - ==
  - ne - !=
  - lt - <
  - gt - >
  - lte - <=
  - gte - >=
  
  - **Для сортировки**
  `sort[asc/desc]: <Название поля в таблице>`
  , где 
  - asc - сортировка по возрастанию
  - desc - сортировка по убыванию
 
