import express from "express";
import Validator from "../supplier/validator.js";
import * as Controller from "../supplier/controller.js";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", authenticateTokenWithPermission('suppliers'), Controller.getSuppliers);
supplierRouter.get("/suppliers/:supplierId", authenticateTokenWithPermission('suppliers'), Controller.getSupplier);
supplierRouter.post("/suppliers", authenticateTokenWithPermission('suppliers'), Validator.create, Controller.createSupplier);
supplierRouter.put("/suppliers/:supplierId", authenticateTokenWithPermission('suppliers'), Validator.update, Controller.updateSupplier);
supplierRouter.delete("/suppliers/:supplierId", authenticateTokenWithPermission('suppliers'), Controller.deleteSupplier);

export default supplierRouter;
