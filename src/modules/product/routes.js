import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getStocksByProductName,
  getProductsByCategoryName,
} from "../product/controller.js";
import { getAllProducts } from "../product/service.js";

const Productrouter = express.Router();

Productrouter.post("/products", createProduct);
Productrouter.get("/products", getProducts);
Productrouter.get("/products/:productId", getProduct);
Productrouter.get("/products/productName/:productName", getStocksByProductName);
Productrouter.get("/products/category/:categoryName", getProductsByCategoryName);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);

export default Productrouter;
