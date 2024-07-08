import express from 'express';
import * as onlineBillControllers from './controller.js';
import validator from './validator.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/onlineBills', validator.create, onlineBillControllers.createOnlineBillController);
router.get('/onlineBills', /*authenticateTokenWithPermission('online-orders'),**/onlineBillControllers.getAllOnlineBillsController);
router.get('/onlineBills/:onlineBillNo', /*authenticateTokenWithPermission('online-orders'),*/onlineBillControllers.getOnlineBillByNumberController);
router.get('/onlineBillsByCustomer/:customerId', /*authenticateTokenWithPermission('online-orders'),*/onlineBillControllers.getOnlineBillsByCustomerId)
router.put('/onlineBills/:onlineBillNo', /*authenticateTokenWithPermission('online-orders'),*/validator.update, onlineBillControllers.updateOnlineBillController);
router.put('/onlineBillAmount/:onlineBillNo', /*authenticateTokenWithPermission('online-orders'),*/validator.update, onlineBillControllers.updateOnlineBillAmountController);
router.get('/billTotalsForDateOnline', /*authenticateTokenWithPermission('online-orders'),*/onlineBillControllers.getSumOfOnlineBillTotalAmountForDateController);
router.get('/daily-online-sales-data', /*authenticateTokenWithPermission('online-orders'),*/onlineBillControllers.getDailyOnlineSalesDataForMonthController);

export default router;
