import express from "express";
import * as Controller from "../stockTransfer/controller.js";

const stockTransferRouter = express.Router();

stockTransferRouter.post("/stockTransferOUT", Controller.createStockTransferAndProduct);
stockTransferRouter.put('/stock-transfer/cancel', Controller.cancelStockTransferBySTN_NO);
stockTransferRouter.get('/stock-transferAllDetails', Controller.getAllStockTransferDetails);
stockTransferRouter.get('/batchNumbers', Controller.fetchBatchNumbers);
stockTransferRouter.get('/allTransfers', Controller.getAllStockTransfersController);


export default stockTransferRouter;
