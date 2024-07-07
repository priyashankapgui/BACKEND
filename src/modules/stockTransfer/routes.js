import express from "express";
import * as Controller from "../stockTransfer/controller.js";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";

const stockTransferRouter = express.Router();

stockTransferRouter.post("/stockTransferOUT", authenticateTokenWithPermission('stock-transfer'), Controller.createStockTransferAndProduct);
stockTransferRouter.put('/stock-transfer/cancel',authenticateTokenWithPermission('stock-transfer'), Controller.cancelStockTransferBySTN_NO);
stockTransferRouter.get('/stock-transferAllDetails',authenticateTokenWithPermission('stock-transfer'), Controller.getAllStockTransferDetails);
stockTransferRouter.get('/batchNumbers',authenticateTokenWithPermission('stock-transfer'), Controller.fetchBatchNumbers);
stockTransferRouter.get('/allTransfers',authenticateTokenWithPermission('stock-transfer'), Controller.getAllStockTransfersController);


export default stockTransferRouter;
