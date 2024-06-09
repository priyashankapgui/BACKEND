import express from 'express';
import * as Controller from '../bill/controller.js';
import Validator from '../bill/validator.js';

const billRouter = express.Router();

billRouter.get('/bills', Controller.getAllBills);
billRouter.get('/bills/:billNo', Controller.getBillByNumber);
billRouter.post('/bills', Validator.create, Controller.createBill);
billRouter.put('/bills/:billNo', Validator.update, Controller.updateCustomerDetails);
billRouter.put('/bills/cancel/:billNo', Controller.cancelBillByNumber);

export default billRouter;
