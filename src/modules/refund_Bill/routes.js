import express from 'express';
import {
    processRefundController,
    getRefundBillByRTBNoController,
    getRefundBillProductsByProductIdController
} from './controller.js';
import Validator from './validator.js';

const refundBillRouter = express.Router();

refundBillRouter.post('/refund', Validator.create, processRefundController);
refundBillRouter.get('/refund/:RTBNo', getRefundBillByRTBNoController);
refundBillRouter.get('/refund/products/:productId', getRefundBillProductsByProductIdController);

export default refundBillRouter;
