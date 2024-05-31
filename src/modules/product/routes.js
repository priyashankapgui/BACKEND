import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  //getStocksByProductName,
  getProductsByCategory,
  //getProductIdByProductNameController,
  //getProductAndSuppliersDetailsByProductName,
  upload,
  getTotalQuantityByBranchAndProduct,
  
} from "../product/controller.js"; 
  getproductsweb,
} from "../product/controller.js";


const Productrouter = express.Router(); 

Productrouter.post("/products", upload, createProduct);
Productrouter.get("/product", getProducts);
Productrouter.get("/products", getProduct);
//Productrouter.get("/products/productName/:productName", getStocksByProductName);
Productrouter.get("/products/category", getProductsByCategory);
Productrouter.delete("/products/:productId", deleteProduct);
Productrouter.put("/products/:productId", updateProduct);
//Productrouter.get("/products/productId/:productName", getProductIdByProductNameController);
//Productrouter.get('/product/:productName', getProductAndSuppliersDetailsByProductName);
Productrouter.get('/active-stock', getTotalQuantityByBranchAndProduct);
//==============================
Productrouter.get("/productweb", getproductsweb);




export default Productrouter;
