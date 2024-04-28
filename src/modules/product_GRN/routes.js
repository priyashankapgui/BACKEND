import express from "express";
import { createProductGRN } from "../product_GRN/controller.js";

const productGRNRouter = express.Router();

productGRNRouter.post("/product-GRN", createProductGRN);

export default productGRNRouter;