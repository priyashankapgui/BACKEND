import express from 'express';
import { createGRNAndProduct, getGRNs, getGRN, getGRNByInvoiceNoController, getGRNByProduct, updateGRN, deleteGRN, getTotalAmountByInvoiceNo, getDetailsByInvoiceNo } from '../GRN/controller.js';

const GRNRouter = express.Router();

GRNRouter.get('/grn', getGRNs);
GRNRouter.get('/grn/:GRN_NO', getGRN);
GRNRouter.get('/grn/invoice/:invoiceNo', getGRNByInvoiceNoController);
GRNRouter.post('/grn', createGRNAndProduct);
GRNRouter.put('/grn/:GRN_NO', updateGRN);
GRNRouter.delete('/grn/:GRN_NO', deleteGRN);
GRNRouter.get('/grn/totalAmount/:invoiceNo', getTotalAmountByInvoiceNo);
GRNRouter.get('/grn/productName', getGRNByProduct);
GRNRouter.get('/grn/productId', getGRNByProduct);
GRNRouter.get('/grn/productId', getGRNByProduct);
GRNRouter.get('/grn/invoice-details/:invoiceNo', getDetailsByInvoiceNo);



export default GRNRouter;