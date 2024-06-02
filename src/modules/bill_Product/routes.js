import express from 'express';
import {
    addBillProductController,
    getAllBillProductsController,
    getBillProductsByBillNoController,
    getBillProductsByProductIdController,
    updateBillProductController,
    deleteBillProductController
} from './controller.js';

const billProductRouter = express.Router();

billProductRouter.post('/billProducts', addBillProductController);
billProductRouter.get('/billProducts', getAllBillProductsController);
billProductRouter.get('/billProducts/bill/:billNo', getBillProductsByBillNoController);
billProductRouter.get('/billProducts/product/:productId', getBillProductsByProductIdController);
billProductRouter.put('/billProducts/:billNo/:productId', updateBillProductController);
billProductRouter.delete('/billProducts/:billNo/:productId', deleteBillProductController);

export default billProductRouter;




