import express from "express";
import { createBranchSupplier } from "../branch_Supplier/controller.js";

const branchSupplierRouter = express.Router();

branchSupplierRouter.post("/branch-supplier", createBranchSupplier);

export default branchSupplierRouter;