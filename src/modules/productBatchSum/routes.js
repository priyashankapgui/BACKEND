import express from 'express';
import * as ProductBatchSumController from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.get('/product-batch-sum', ProductBatchSumController.getAllProductBatchSumController);
productBatchSumrouter.get('/product-batch-details', ProductBatchSumController.getBatchDetailsByProductNameController);
productBatchSumrouter.get("/adjust-stock", ProductBatchSumController.getProductBatchDetailsController);
productBatchSumrouter.get('/products-by-branch', ProductBatchSumController.getAllProductsByBranchController);
productBatchSumrouter.get('/products-by-barcode', ProductBatchSumController.getProductsByBarcodeController);

export default productBatchSumrouter;
