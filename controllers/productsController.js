module.exports = {
  getProductsHandler(req, res, next) {
    console.log("get Product");
    res.send();
    return next();
  },
  createProductHandler(req, res, next) {
    console.log("create Product");
    res.send();
    return next();
  },
  updateProductHandler(req, res, next) {
    console.log("update Product");
    res.send();
    return next();
  },
  deleteProductHandler(req, res, next) {
    console.log("delete Product");
    res.send();
    return next();
  },
};
