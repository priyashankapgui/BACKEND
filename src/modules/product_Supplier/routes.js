
import express from "express";
import { createProductSupplier, getProductDetailsByProductNameController } from "../product_Supplier/controller.js";

const productSupplierRouter = express.Router();

productSupplierRouter.post("/product_suppliers", createProductSupplier);
productSupplierRouter.get("/products/:productName", getProductDetailsByProductNameController);

export default productSupplierRouter;