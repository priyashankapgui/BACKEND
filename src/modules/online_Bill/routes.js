import express from 'express';
import * as onlineBillControllers from './controller.js';
import validator from './validator.js';

const router = express.Router();

router.post('/onlineBills', validator.create,onlineBillControllers.createOnlineBillController);
router.get('/onlineBills', onlineBillControllers.getAllOnlineBillsController);
router.get('/onlineBills/:onlineBillNo', onlineBillControllers.getOnlineBillByNumberController);
router.put('/online-bills/:onlineBillNo', validator.update,onlineBillControllers.updateOnlineBillController);

export default router;
