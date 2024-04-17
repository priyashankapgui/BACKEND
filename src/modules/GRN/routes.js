import express from 'express';
import { createGRN, getGRNs, getGRN, getGRNByInvoiceNoController, getGRNByCriteria, updateGRN, deleteGRN } from '../GRN/controller.js';

const GRNRouter = express.Router();

GRNRouter.get('/grn', getGRNs);
GRNRouter.get('/grn/:GRN_NO', getGRN);
GRNRouter.get('/grn/invoice/:invoiceNo', getGRNByInvoiceNoController);
//stockRouter.get('/stocks/search', getStockByCriteria);
GRNRouter.post('/grn', createGRN);
GRNRouter.put('/grn/:GRN_NO', updateGRN);
GRNRouter.delete('/grn/:GRN_NO', deleteGRN);



export default GRNRouter;