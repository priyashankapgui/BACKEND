import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getStocksByProductName,
  getProductsByCategoryName,
  getProductIdByProductNameController,
  // getProductDetailsByProductNameController,
  getProductAndSuppliersDetailsByProductName,
  upload,
  
} from "../product/controller.js";
import { getAllProducts } from "../product/service.js";

const Productrouter = express.Router();

Productrouter.post("/products", upload, createProduct);
Productrouter.get("/products", getProducts);
Productrouter.get("/products/:productId", getProduct);
Productrouter.get("/products/productName/:productName", getStocksByProductName);
Productrouter.get("/products/category/:categoryName", getProductsByCategoryName);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);
Productrouter.get("/products/productId/:productName", getProductIdByProductNameController);
// Productrouter.get("/products/details/:productName", getProductDetailsByProductNameController);
Productrouter.get('/product/:productName', getProductAndSuppliersDetailsByProductName);
export default Productrouter;
