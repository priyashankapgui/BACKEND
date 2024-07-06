import express from 'express';
import * as Controller from '../productBatchUpdateReason/controller.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const productBatchUpdateReasonRouter = express.Router();

productBatchUpdateReasonRouter.put('/adjust-stock-quantity', authenticateTokenWithPermission('stock-balance'), Controller.adjustStockDetails);

export default productBatchUpdateReasonRouter;
