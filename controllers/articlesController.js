module.exports = {
  getArticlesHandler(req, res, next) {
    console.log("get article");
    res.send();
    return next();
  },
  createArticleHandler(req, res, next) {
    console.log("create article");
    res.send();
    return next();
  },
  updateArticleHandler(req, res, next) {
    console.log("update article");
    res.send();
    return next();
  },
  deleteArticleHandler(req, res, next) {
    console.log("delete article");
    res.send();
    return next();
  },
};
