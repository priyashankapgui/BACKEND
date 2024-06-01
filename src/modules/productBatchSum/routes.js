import express from 'express';
import { updateProductBatchSumController, getBatchDetailsByProductNameController } from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.post('/update-product-batch-sum', updateProductBatchSumController);
productBatchSumrouter.get( "/product-Batch-Sum", getBatchDetailsByProductNameController);

export default productBatchSumrouter;
 