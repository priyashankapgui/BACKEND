import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsByCategory,
  upload,
  getTotalQuantityByBranchAndProduct,
  
} from "../product/controller.js"; 


const Productrouter = express.Router(); 

Productrouter.post("/products", upload, createProduct);
Productrouter.get("/product", getProducts);
Productrouter.get("/products", getProduct);
Productrouter.get("/products/category", getProductsByCategory);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);
Productrouter.get('/active-stock', getTotalQuantityByBranchAndProduct);



 
export default Productrouter;
