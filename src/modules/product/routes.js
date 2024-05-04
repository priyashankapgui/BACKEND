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
  getProductAndSuppliersDetailsByProductName,
  upload,
  getTotalQuantityByBranchAndProduct,
  
} from "../product/controller.js";


const Productrouter = express.Router();

Productrouter.post("/products", upload, createProduct);
Productrouter.get("/products", getProducts);
Productrouter.get("/products/:productId", getProduct);
Productrouter.get("/products/productName/:productName", getStocksByProductName);
Productrouter.get("/products/category/:categoryName", getProductsByCategoryName);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);
Productrouter.get("/products/productId/:productName", getProductIdByProductNameController);
Productrouter.get('/product/:productName', getProductAndSuppliersDetailsByProductName);
Productrouter.get('/active-stock', getTotalQuantityByBranchAndProduct);




export default Productrouter;
