import express from 'express';
import * as ProductBatchSumController from '../productBatchSum/controller.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const productBatchSumrouter = express.Router();

productBatchSumrouter.get('/product-batch-sum', ProductBatchSumController.getAllProductBatchSumController);
productBatchSumrouter.get('/product-batch-details', authenticateTokenWithPermission('products'), ProductBatchSumController.getBatchDetailsByProductNameController);
productBatchSumrouter.get("/adjust-stock",authenticateTokenWithPermission('stock-balance'), ProductBatchSumController.getProductBatchDetailsController);
productBatchSumrouter.get('/products-by-branch', ProductBatchSumController.getAllProductsByBranchController);
productBatchSumrouter.get('/products-by-barcode', ProductBatchSumController.getProductsByBarcodeController);
productBatchSumrouter.get('/product-batch-sum-stockdata-branch', ProductBatchSumController.getAllProductBatchSumDataByBranchController);
productBatchSumrouter.get('/product-batch-sum-upexp-stock-branch', ProductBatchSumController.getUpcomingExpProductBatchSumDataByBranchController);
productBatchSumrouter.get('/product-batch-sum-expired-stock-branch', ProductBatchSumController.getAlreadyExpProductBatchSumDataByBranchController);
productBatchSumrouter.put('/product-batch-sum-discount', authenticateTokenWithPermission('products'), ProductBatchSumController.updateDiscount);
productBatchSumrouter.get('/product-quantities', authenticateTokenWithPermission('stock-balance'), ProductBatchSumController.getProductQuantities);
productBatchSumrouter.get('/product-branch', ProductBatchSumController.getProductDetailsByBranchNameController);



export default productBatchSumrouter;
