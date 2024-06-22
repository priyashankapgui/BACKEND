import express from 'express';
import * as Controller from "../GRN/controller.js"

const GRNRouter = express.Router();

GRNRouter.get('/grn', Controller.getGRNs);
GRNRouter.get('/grn/:GRN_NO', Controller.getGRN);
GRNRouter.get('/grn/invoice/:invoiceNo', Controller.getGRNByInvoiceNoController);
GRNRouter.post('/grn', Controller.createGRNAndProduct);
GRNRouter.get('/grn/totalAmount/:invoiceNo', Controller.getTotalAmountByInvoiceNo);
GRNRouter.get('/grn-date-range', Controller.getGRNsByDateRangeController);
GRNRouter.get('/grn-all', Controller.getGRNDetailsController);
GRNRouter.get('/grn-product-all', Controller.getGRNsController);
GRNRouter.get('/grn-supplier-all', Controller.getGRNsSupplierController);







export default GRNRouter;