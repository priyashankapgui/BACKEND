import express from "express";
//import Validator from "../category/validator.js";
import * as  TransferProductBatchController from "../TransferProductBatch/controller.js";

const TransferProductBatchRouter = express.Router();

TransferProductBatchRouter.post("/stockTransferIN", TransferProductBatchController.submitStockTransferAndProductBatch);
TransferProductBatchRouter.put('/update-product-batch-sum', TransferProductBatchController.updateOrAddProductBatchSumController);


 
export default TransferProductBatchRouter;
 