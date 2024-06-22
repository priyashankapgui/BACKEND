import * as CartCustomerController from "../category/controller.js";
import * as CartCustomerService from "../category/service.js";
import * as CartCustomerRoutes from "../category/routes.js";
import ShoppingCart from "../category/category.js";

module.exports = {
  Controller: CartCustomerController,
  Service: CartCustomerService,
  Routes: CartCustomerRoutes,
  Category: ShoppingCart,
};

