import express from "express";
import { getBatchDetailsByProductNameController, adjustProductQuantity, getproductGRN } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();

productGRNRouter.get( "/product-GRN", getBatchDetailsByProductNameController);
productGRNRouter.get("/adjust-stock", adjustProductQuantity);
productGRNRouter.get("/productGRNweb", getproductGRN);



export default productGRNRouter; 