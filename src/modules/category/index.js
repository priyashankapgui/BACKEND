import * as CategoryController from "../category/controller.js";
import * as CategoryService from "../category/service.js";
import * as categoryRouter from "../category/routes.js";
import categories from "../category/category.js";

export default  {
  Controller: CategoryController,
  Service: CategoryService,
  Routes: categoryRouter,
  Category: categories,
};

