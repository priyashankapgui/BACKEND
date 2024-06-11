import express from 'express';
import * as Controller from '../productBatchUpdateReason/controller.js'

const productBatchUpdateReasonRouter = express.Router();

productBatchUpdateReasonRouter.put('/adjust-stock-quantity', Controller.adjustStockDetails);

export default productBatchUpdateReasonRouter;
