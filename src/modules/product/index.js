import * as ProductController from "../product/controller.js";
import * as ProductService from "../product/service.js";
import * as ProductRoutes from "../product/routes.js";
import Products from "../product/product.js";

module.exports = {
  Controller: ProductController,
  Service: ProductService,
  Routes: ProductRoutes,
  Product: Products,
};
