import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getStocksByProductName,
  getProductsByCategoryAndBranch,
  getProductIdByProductNameController,
  getProductAndSuppliersDetailsByProductName,
  upload,
  getTotalQuantityByBranchAndProduct,
  getproductsweb,
} from "../product/controller.js";


const Productrouter = express.Router();

Productrouter.post("/products", upload, createProduct);
Productrouter.get("/product", getProducts);
Productrouter.get("/products", getProduct);
Productrouter.get("/products/productName/:productName", getStocksByProductName);
Productrouter.get("/products/category", getProductsByCategoryAndBranch);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);
Productrouter.get("/products/productId/:productName", getProductIdByProductNameController);
Productrouter.get('/product/:productName', getProductAndSuppliersDetailsByProductName);
Productrouter.get('/active-stock', getTotalQuantityByBranchAndProduct);
//==============================
Productrouter.get("/productweb", getproductsweb);




export default Productrouter;
