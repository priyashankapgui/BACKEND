import express from 'express';
import {  getProducts, getProduct, createProduct , deleteProduct , updateProduct } from '../product/controller.js';
import { getAllProducts } from '../product/service.js';

const Productrouter = express.Router();

Productrouter.post('/products', createProduct);
Productrouter.get('/products', getProducts);
Productrouter.get('/products/:productId', getProduct);
Productrouter.delete('/:productId', deleteProduct);
Productrouter.put('/:productId', updateProduct);

export default Productrouter;
