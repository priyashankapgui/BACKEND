import express from 'express';
import * as ProductBatchSumController from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

//productBatchSumrouter.post('/update-product-batch-sum', updateProductBatchSumController);
productBatchSumrouter.get('/product-batch-sum', ProductBatchSumController.getAllProductBatchSumController); 
productBatchSumrouter.get('/product-batch-details', ProductBatchSumController.getBatchDetailsByProductNameController); // this endpoint is for ckeck price
productBatchSumrouter.get('/product-batch-sum/:productId', ProductBatchSumController.getProductSumBatchByProductIdController); 
productBatchSumrouter.get('/product-batch-sum/barcode/:barcode', ProductBatchSumController.getProductSumBatchByBarcodeController); 
productBatchSumrouter.get('/product-batch-sum/branch/:branchId', ProductBatchSumController.getBatchSumByBranchIdController); 
productBatchSumrouter.get("/adjust-stock", ProductBatchSumController.adjustProductQuantity); // this endpont is for adjust the stcok quantity

//New
productBatchSumrouter.get('/products/branch/:branchName', ProductBatchSumController.getAllProductsByBranchController);
productBatchSumrouter.get('/product-details/:productId/branch/:branchName', ProductBatchSumController.getProductDetailsByBranchController);


export default productBatchSumrouter;
