import express from 'express';
import { updateProductBatchSumController,getdiscount } from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.post('/update-product-batch-sum', updateProductBatchSumController);
productBatchSumrouter.get("/productdiscount", getdiscount);

export default productBatchSumrouter;
 