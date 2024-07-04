import express from 'express';
import * as onlineBillControllers from './controller.js';
import validator from './validator.js';
import { authenticateCustomerToken } from '../../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/onlineBills', validator.create, onlineBillControllers.createOnlineBillController);
router.get('/onlineBills', onlineBillControllers.getAllOnlineBillsController);
router.get('/onlineBills/:onlineBillNo', onlineBillControllers.getOnlineBillByNumberController);
router.get('/onlineBillsByCustomer/:customerId', authenticateCustomerToken,onlineBillControllers.getOnlineBillsByCustomerId)
router.put('/onlineBills/:onlineBillNo', validator.update, onlineBillControllers.updateOnlineBillController);
router.put('/onlineBillAmount/:onlineBillNo', validator.update, onlineBillControllers.updateOnlineBillAmountController);
router.get('/billTotalsForDateOnline', onlineBillControllers.getSumOfOnlineBillTotalAmountForDateController);
router.get('/daily-online-sales-data', onlineBillControllers.getDailyOnlineSalesDataForMonthController);

export default router;
