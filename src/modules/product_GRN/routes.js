import express from "express";
import {  adjustProductQuantity } from "../product_GRN/controller.js";
import { getBatchDetailsByProductNameController, adjustProductQuantity, getproductGRN } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();


productGRNRouter.get("/adjust-stock", adjustProductQuantity);
productGRNRouter.get("/productGRNweb", getproductGRN);



export default productGRNRouter; 