import * as billService from '../bill/service.js';
import * as billController from '../bill/controller.js';
import billRouter from '../bill/routes.js';
import bill from '../bill/bill.js';
import * as billProductService from '../bill_Product/service.js';
import billProduct from '../bill_Product/bill_Product.js';

export default {
  Controller: billController,
  Service: billService,
  Routes: billRouter,
  bill: bill,
  billProductService: billProductService,
  billProduct: billProduct,
};
