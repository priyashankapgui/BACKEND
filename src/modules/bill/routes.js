import express from 'express';
import {
    getBillData,
    getBillDataByNo,
    addBillData,
    cancelBillDataByNo
} from "../bill/controller.js";

const billRouter = express.Router();

billRouter.get('/bills', getBillData);
billRouter.get('/bills/:billNo', getBillDataByNo);
billRouter.post('/bills', addBillData);
billRouter.put('/bills/cancel/:billNo', cancelBillDataByNo);

export default billRouter;
