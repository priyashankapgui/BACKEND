import express from 'express';
import { addlistedProduct, getAlllistedProducts, getlistedProduct, deletelistedProduct, getlistedProductBybarcode } from '../listedProducts/controller.js';

const listedProductsRouter = express.Router();

listedProductsRouter.get('/listedProducts', getAlllistedProducts);
listedProductsRouter.get('/listedProducts/:productId', getlistedProduct);
listedProductsRouter.get('/listedProducts/barcode/:barcode', getlistedProductBybarcode);

listedProductsRouter.post('/listedProducts', addlistedProduct);
listedProductsRouter.delete('/listedProducts/:productId', deletelistedProduct);
export default listedProductsRouter;