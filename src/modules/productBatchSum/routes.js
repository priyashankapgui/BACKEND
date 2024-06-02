import express from 'express';
import {
    updateProductBatchSumController,
    getBatchDetailsByProductNameController,
    getAllProductBatchSumController,
    getProductSumBatchByProductIdController,
    getProductSumBatchByBarcodeController,
    getBatchSumByBranchIdController 
} from '../productBatchSum/controller.js';
import { updateProductBatchSumController,getdiscount } from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.post('/update-product-batch-sum', updateProductBatchSumController);
productBatchSumrouter.get('/product-batch-sum', getAllProductBatchSumController); 
productBatchSumrouter.get('/product-batch-details', getBatchDetailsByProductNameController);
productBatchSumrouter.get('/product-batch-sum/:productId', getProductSumBatchByProductIdController); 
productBatchSumrouter.get('/product-batch-sum/barcode/:barcode', getProductSumBatchByBarcodeController); 
productBatchSumrouter.get('/product-batch-sum/branch/:branchId', getBatchSumByBranchIdController); 
productBatchSumrouter.get("/productdiscount", getdiscount);

export default productBatchSumrouter;
