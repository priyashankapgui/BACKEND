import express from "express";
//import Validator from "../category/validator.js";
import * as  TransferProductBatchController from "../TransferProductBatch/controller.js";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";

const TransferProductBatchRouter = express.Router();

TransferProductBatchRouter.post("/stockTransferIN", authenticateTokenWithPermission('stock-transfer'), TransferProductBatchController.submitStockTransferAndProductBatch);
TransferProductBatchRouter.put('/update-product-batch-sum',authenticateTokenWithPermission('stock-transfer'), TransferProductBatchController.updateOrAddProductBatchSumController);


 
export default TransferProductBatchRouter;
 