import express from "express";
import {  adjustProductQuantity } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();


productGRNRouter.get("/adjust-stock", adjustProductQuantity);



export default productGRNRouter; 