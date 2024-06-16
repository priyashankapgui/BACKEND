import express from 'express';
import * as Controller from '../bill/controller.js';
import Validator from '../bill/validator.js';

const billRouter = express.Router();

billRouter.get('/bills', Controller.getAllBillsController);
billRouter.get('/bills/:billNo', Controller.getBillByNumberController);
billRouter.post('/bills', Validator.create, Controller.createBillController);
billRouter.put('/bills/:billNo', Validator.update, Controller.updateCustomerDetailsController);
billRouter.put('/bills/cancel/:billNo', Controller.cancelBillByNumberController);
billRouter.get('/bills-all', Controller.getBillDetailsController);


export default billRouter;
