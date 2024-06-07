import express from "express";
import Validator from "../supplier/validator.js";
import * as Controller from "../supplier/controller.js"

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", Controller.getSuppliers);
supplierRouter.get("/suppliers/:supplierId", Controller.getSupplier);
supplierRouter.post("/suppliers", Validator.create, Controller.createSupplier);
supplierRouter.put("/suppliers/:supplierId", Validator.update, Controller.updateSupplier);
supplierRouter.delete("/suppliers/:supplierId", Controller.deleteSupplier);

export default supplierRouter;
