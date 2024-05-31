import express from 'express';
import { updateProductBatchSumController } from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.post('/update-product-batch-sum', updateProductBatchSumController);

export default productBatchSumrouter;
 