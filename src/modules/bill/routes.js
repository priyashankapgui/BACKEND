import express from 'express';
import * as Controller from '../bill/controller.js';
import Validator from '../bill/validator.js';

const billRouter = express.Router();

billRouter.get('/bills', Controller.getAllBillsController);
billRouter.get('/bills/:billNo', Controller.getBillByNumberController);
billRouter.post('/bills', Validator.create, Controller.createBillController);
billRouter.put('/bills/:billNo', Validator.update, Controller.updateCustomerDetailsController);
billRouter.post('/bills/cancel', Controller.cancelBillByNumberController);
billRouter.get('/bills-all', Controller.getBillDetailsController);
billRouter.get('/billTotalAmountForDate', Controller.getSumOfBillTotalAmountForDateController);
billRouter.get('/netBillTotalAmountForDate', Controller.getNetTotalAmountForDateController);
billRouter.get('/daily-sales-data-chart', Controller.getDailySalesDataForMonthController);
billRouter.get('/bills-by-branch-and-date-range', Controller.getAllBillsByBranchAndDateRangeController);


export default billRouter;
