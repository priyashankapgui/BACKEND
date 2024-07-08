import express from 'express';
import * as OnlineBillProductController from './controller.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/addproductstobill', OnlineBillProductController.addProductsToBill);
router.get('/onlineBillProducts', /*authenticateTokenWithPermission('online-orders'),*/OnlineBillProductController.getAllOnlineBillProducts);
router.get('/onlineBillProducts/:onlineBillNo', /*authenticateTokenWithPermission('online-orders'),*/OnlineBillProductController.getOnlineBillProductsByBillNo);

export default router;
