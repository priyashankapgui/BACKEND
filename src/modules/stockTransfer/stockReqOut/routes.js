import express from "express";
import {stockTransferController} from "../stockReqOut/controller.js"

const stockReqInRouter = express.Router();


// Route to handle creating a new stock transfer
stockReqInRouter.post('/stock-transfers', stockTransferController.createStockTransfer);

module.exports = stockReqInRouter;