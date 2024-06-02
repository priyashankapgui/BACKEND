import express from "express";
import Validator from "../supplier/validator.js";
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./controller.js";

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.get("/suppliers/:supplierId", getSupplier);
supplierRouter.post("/suppliers", Validator.create, createSupplier);
supplierRouter.put("/suppliers/:supplierId", updateSupplier);
supplierRouter.delete("/suppliers/:supplierId", deleteSupplier);

export default supplierRouter;
