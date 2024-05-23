import express from "express";
import { getBatchDetailsByProductNameController, adjustProductQuantity } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();

productGRNRouter.get( "/product-GRN", getBatchDetailsByProductNameController);
productGRNRouter.get("/adjust-stock", adjustProductQuantity);



export default productGRNRouter; 