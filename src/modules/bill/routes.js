import express from 'express';
import * as Controller from '../bill/controller.js';
import Validator from '../bill/validator.js';

const billRouter = express.Router();

billRouter.get('/bills', Controller.getBillData);
billRouter.get('/bills/:billNo', Controller.getBillDataByNo);
billRouter.post('/bills', Validator.create, Controller.addBillData);
billRouter.put('/bills/:billNo', Validator.update, Controller.updateCustomerDetails);
billRouter.put('/bills/cancel/:billNo', Controller.cancelBillDataByNo);


export default billRouter;
