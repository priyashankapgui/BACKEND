import express from 'express';
import * as OnlineBillProductController from './controller.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/addproductstobill', OnlineBillProductController.addProductsToBill);
router.get('/onlineBillProducts', OnlineBillProductController.getAllOnlineBillProducts);
router.get('/onlineBillProducts/:onlineBillNo', OnlineBillProductController.getOnlineBillProductsByBillNo);

export default router;
