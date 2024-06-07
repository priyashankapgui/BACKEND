import express from 'express';
import {
    addProductToRefundBillController,
    getRefundBillProductsByRTBNoController
} from './controller.js';
import Validator from './validator.js';

const refundBillProductRouter = express.Router();

refundBillProductRouter.post('/refund/product', Validator.create, addProductToRefundBillController);
refundBillProductRouter.get('/refund/products/:RTBNo', getRefundBillProductsByRTBNoController);

export default refundBillProductRouter;
