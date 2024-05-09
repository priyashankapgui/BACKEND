import express from "express";
import { getBatchDetailsByProductNameController, getAvailableQuantityByBranchAndProduct, adjustProductQuantity } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();

productGRNRouter.get( "/product-GRN", getBatchDetailsByProductNameController);
productGRNRouter.get("/active-stockBatchWise", getAvailableQuantityByBranchAndProduct);
productGRNRouter.get("/adjust-stock", adjustProductQuantity);

//productGRNRouter.get('/expired-stock', getExpiredStockController);

export default productGRNRouter; 