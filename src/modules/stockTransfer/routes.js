import express from "express";
import * as Controller from "../stockTransfer/controller.js";

const stockTransferRouter = express.Router();

stockTransferRouter.post("/stockTransferOUT", Controller.createStockTransferAndProduct);
stockTransferRouter.get('/stock-transfer/supplying-branch/:supplyingBranch', Controller.fetchStockTransfersBySupplyingBranch);
stockTransferRouter.get('/stock-transfer/request-branch/:requestBranch', Controller.getStockTransfersByBranch);
stockTransferRouter.put('/stock-transfer/cancel', Controller.cancelStockTransferBySTN_NO);
stockTransferRouter.get('/stock-transferDetails/:STN_NO', Controller.getStockTransferDetails);
stockTransferRouter.get('/stock-transferAllDetails/:STN_NO', Controller.getAllStockTransferDetails);
stockTransferRouter.get('/stock-transfers-by-date-range', Controller.getStockTransfersByDateRangeController);
stockTransferRouter.get('/stock-transfers-by-productId/:productId',Controller.getStockTransfersByProductIdController);
stockTransferRouter.get('/batchNumbers', Controller.fetchBatchNumbers);
stockTransferRouter.get('/allTransfers', Controller.getAllStockTransfersController);


export default stockTransferRouter;
