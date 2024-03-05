import products from './src/modules/product/product.js';
import productRouter from './src/modules/product/routes.js';
import { getProducts } from '../product/controller.js';
import { get_Products} from '../product/service.js';



module.exports = {
  ProductConstants: constants,

  ProductService: service,

  ProductController: controller,

  ProductRoutes: routes,

  Product: Product,
};
