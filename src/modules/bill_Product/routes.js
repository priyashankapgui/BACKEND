import express from 'express';
import * as Controller from './controller.js';
import Validator from './validator.js';

const billProductRouter = express.Router();

billProductRouter.post('/bill-products', Validator.create, Controller.addBillProductController);
billProductRouter.get('/bill-products', Controller.getAllBillProductsController);
billProductRouter.get('/bill-products/:billNo', Controller.getBillProductsByBillNoController);
billProductRouter.get('/bill-products/product/:productId', Controller.getBillProductsByProductIdController);

export default billProductRouter;
