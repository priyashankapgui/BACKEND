import express from "express";
import { createProductSupplier, getProductDetailsByProductNameController } from "../product_Supplier/controller.js";

const productSupplierRouter = express.Router();

productSupplierRouter.post("/product-suppliers", createProductSupplier);
productSupplierRouter.get("/products/:productName", getProductDetailsByProductNameController);

export default productSupplierRouter;

// import express from 'express'; 
// import productSupplier from '../product_Supplier/product_Supplier.js';
// const productSupplierRouter = express.Router();
// // Assuming productSupplier is already imported

// // productSupplierRouter.post('/product-suppliers', async (req, res) => {
// //   try {
// //     const { productId, supplierId } = req.body;
// //     // Validate input
// //     if (!productId || !supplierId) {
// //       return res.status(400).json({ error: 'productId and supplierId are required' });
// //     }
// //     // Attempt to insert into the database
// //     const newProductSupplier = await productSupplier.create({ productId, supplierId });
// //     // If successful, send back the inserted data
// //     res.json(newProductSupplier);
// //   } catch (error) {
// //     console.error('Error inserting into product_Supplier table:', error);

// //     // Checking for Sequelize validation errors
// //     if (error.name === 'SequelizeValidationError') {
// //       return res.status(400).json({ error: 'Validation error', details: error.errors });
// //     }

// //     // Handling Sequelize ForeignKeyConstraintError
// //     if (error.name === 'SequelizeForeignKeyConstraintError') {
// //       return res.status(400).json({ error: 'Foreign key constraint error', details: error.message });
// //     }

// //     // Handling unique constraint error (e.g., trying to insert a duplicate entry)
// //     if (error.name === 'SequelizeUniqueConstraintError') {
// //       return res.status(409).json({ error: 'Unique constraint error', details: error.message });
// //     }

// //     // For other types of errors, return a generic server error
// //     res.status(500).json({ error: 'Internal server error', details: error.message });
// //   }
// // });

// export default productSupplierRouter;


// import express from 'express';
// import { createProductSupplier } from './controller.js';

// const router = express.Router();

// router.post('/product-suppliers', createProductSupplier);

// export default router;
