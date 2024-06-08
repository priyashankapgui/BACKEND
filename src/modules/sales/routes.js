import express from 'express';
import { getDailySalesForBranch, getAllSalesData } from './controller.js';
import Validator from './validator.js';

const salesRouter = express.Router();

salesRouter.get('/sales/daily', Validator.validateSalesQuery, getDailySalesForBranch);
salesRouter.get('/sales', getAllSalesData);

export default salesRouter;
