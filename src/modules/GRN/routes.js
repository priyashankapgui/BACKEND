import express from 'express';
//import { createGRNAndProduct, getGRNs, getGRN, getGRNByInvoiceNoController, getGRNBySupplier, getGRNByBranch, updateGRN, deleteGRN, getTotalAmountByInvoiceNo,  getGRNsByBranchAndSupplierController, getGRNDetailsByProductIdController , getGRNsByDateRangeController } from '../GRN/controller.js';
import * as Controller from "../GRN/controller.js"
//import validateGRN from '../GRN/validator.js';

const GRNRouter = express.Router();

GRNRouter.get('/grn', Controller.getGRNs);
GRNRouter.get('/grn/:GRN_NO', Controller.getGRN);
GRNRouter.get('/grn/invoice/:invoiceNo', Controller.getGRNByInvoiceNoController);
GRNRouter.post('/grn', Controller.createGRNAndProduct);
GRNRouter.get('/grn/totalAmount/:invoiceNo', Controller.getTotalAmountByInvoiceNo);
GRNRouter.get('/grn-supplier/:supplierId', Controller.getGRNBySupplier);
GRNRouter.get('/grn-details/product/:productId', Controller.getGRNDetailsByProductIdController);
GRNRouter.get('/grn-branch',Controller.getGRNByBranch);
GRNRouter.get('/grn-branch-supplier',Controller.getGRNsByBranchAndSupplierController);
GRNRouter.get('/grn-date-range', Controller.getGRNsByDateRangeController);



//GRNRouter.put('/grn/:GRN_NO', updateGRN);
//GRNRouter.delete('/grn/:GRN_NO', deleteGRN);
//GRNRouter.get('/grn-invoice-details', getDetailsByInvoiceNo);
//GRNRouter.get('/grn-branch-product',getGRNsAndProductGRNDataByBranchNameAndProductIdController);


export default GRNRouter;