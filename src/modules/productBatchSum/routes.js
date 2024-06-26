import express from 'express';
import * as ProductBatchSumController from '../productBatchSum/controller.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.get('/product-batch-sum', ProductBatchSumController.getAllProductBatchSumController);
productBatchSumrouter.get('/product-batch-details', ProductBatchSumController.getBatchDetailsByProductNameController);
productBatchSumrouter.get("/adjust-stock", ProductBatchSumController.getProductBatchDetailsController);
productBatchSumrouter.get('/products-by-branch', ProductBatchSumController.getAllProductsByBranchController);
productBatchSumrouter.get('/products-by-barcode', ProductBatchSumController.getProductsByBarcodeController);
productBatchSumrouter.get('/product-batch-sum-stockdata-branch', ProductBatchSumController.getAllProductBatchSumDataByBranchController);
productBatchSumrouter.get('/product-batch-sum-upexp-stock-branch', ProductBatchSumController.getUpcomingExpProductBatchSumDataByBranchController);
productBatchSumrouter.put('/product-batch-sum-discount', ProductBatchSumController.updateDiscount);
productBatchSumrouter.get('/product-quantities-by-branch', ProductBatchSumController.getProductQuantitiesByBranchController);
productBatchSumrouter.get('/product-quantities', ProductBatchSumController.getProductQuantities);
productBatchSumrouter.get('/product-branch', ProductBatchSumController.getProductDetailsByBranchNameController);



export default productBatchSumrouter;
