import express from 'express';
import { createGRNAndProduct, getGRNs, getGRN, getGRNByInvoiceNoController, getGRNBySupplier, getGRNByBranch, updateGRN, deleteGRN, getTotalAmountByInvoiceNo, getDetailsByInvoiceNo, getGRNDetailsByProductIdController } from '../GRN/controller.js';

const GRNRouter = express.Router();

GRNRouter.get('/grn', getGRNs);
GRNRouter.get('/grn/:GRN_NO', getGRN);
GRNRouter.get('/grn/invoice/:invoiceNo', getGRNByInvoiceNoController);
GRNRouter.post('/grn', createGRNAndProduct);
GRNRouter.put('/grn/:GRN_NO', updateGRN);
GRNRouter.delete('/grn/:GRN_NO', deleteGRN);
GRNRouter.get('/grn/totalAmount/:invoiceNo', getTotalAmountByInvoiceNo);
GRNRouter.get('/grn-supplier/:supplierId', getGRNBySupplier);
GRNRouter.get('/grn-details/product/:productId', getGRNDetailsByProductIdController);
GRNRouter.get('/grn-invoice-details', getDetailsByInvoiceNo);
GRNRouter.get('/grn-branch/:branchId',getGRNByBranch);



export default GRNRouter;