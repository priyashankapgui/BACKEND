import express from "express";
import { addToCart, removeFromCart } from "./controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.delete("/remove/:customerId/:productId", removeFromCart);

export default router; // Exporting the router instead of default

