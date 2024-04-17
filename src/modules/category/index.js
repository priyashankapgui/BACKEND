import * as CategoryController from "../category/controller.js";
import * as CategoryService from "../category/service.js";
import * as CategoryRoutes from "../category/routes.js";
import categories from "../category/category.js";

module.exports = {
  Controller: CategoryController,
  Service: CategoryService,
  Routes: CategoryRoutes,
  Category: categories,
};
