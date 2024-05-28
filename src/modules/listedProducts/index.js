import listedProductsRouter from './routes.js';
import * as service from './service.js'; // Import all functions from service.js
import * as controller from './controller.js'; // Import all functions from controller.js
import * as constants from './constants.js'; // Import all constants from constants.js
import ListedProducts from './listedProducts.js';

module.exports = {
    listedProductsConstants: constants,
    listedProductsService: service,
    listedProductsController: controller,
    listedProductsRoutes: listedProductsRouter, // Corrected variable name
    listedProducts: ListedProducts, // Export the ListedProducts model
};
