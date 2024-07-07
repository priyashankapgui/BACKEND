import express from 'express';
import * as refundBillController from './controller.js';
import Validator from './validator.js';

const refundBillRouter = express.Router();

refundBillRouter.post('/refund', Validator.create, refundBillController.createRefundBillController);
refundBillRouter.get('/refund', refundBillController.getAllRefundBillsController);
// refundBillRouter.get('/refund/:RTBNo', refundBillController.getRefundBillByRTBNoController);
refundBillRouter.get('/refund/products/:productId', refundBillController.getRefundBillProductsByProductIdController);
refundBillRouter.get('/refund-all', refundBillController.getRefundBillDetailsController);
refundBillRouter.get('/refund/bill/:billNo', refundBillController.getRefundBillProductsByBillNumberController);
refundBillRouter.get('/refund/branch-date-range', refundBillController.getRefundBillsByBranchAndDateRangeController);


export default refundBillRouter;
