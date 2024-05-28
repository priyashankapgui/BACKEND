import express from "express";
import {
  getSuppliers,
  getSupplier,
  getSupplierBySupplierName,
  getSuppliersByProductId,
  getSuppliersByProductName,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./controller.js";

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.get("/suppliers/:supplierId", getSupplier);
supplierRouter.get("/suppliers/supplierName", getSupplierBySupplierName);
supplierRouter.get("/suppliers/productSupplier/:productId", getSuppliersByProductId);
supplierRouter.get("/suppliers/products/:productName", getSuppliersByProductName);
supplierRouter.post("/suppliers", createSupplier);
supplierRouter.put("/suppliers/:supplierId", updateSupplier);
supplierRouter.delete("/suppliers/:supplierId", deleteSupplier);

export default supplierRouter;
