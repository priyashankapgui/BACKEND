import express from 'express';
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from './controller.js';

const supplierRouter = express.Router();

supplierRouter.get('/suppliers', getAllSuppliers);
supplierRouter.get('/suppliers/:id', getSupplierById);
supplierRouter.post('/suppliers', createSupplier);
supplierRouter.put('/suppliers/:id', updateSupplier);
supplierRouter.delete('/suppliers/:id', deleteSupplier);

export default supplierRouter;
