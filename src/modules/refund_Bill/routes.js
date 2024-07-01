import express from 'express';
import * as refundBillController from './controller.js';
import Validator from './validator.js';

const refundBillRouter = express.Router();

refundBillRouter.post('/refund', Validator.create, refundBillController.createRefundBillController);
refundBillRouter.get('/refund', refundBillController.getAllRefundBillsController);
refundBillRouter.get('/refund/:RTBNo', refundBillController.getRefundBillByRTBNoController);
refundBillRouter.get('/refund/products/:productId', refundBillController.getRefundBillProductsByProductIdController);
refundBillRouter.get('/refund-all', refundBillController.getRefundBillDetailsController);

export default refundBillRouter;
