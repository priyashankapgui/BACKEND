import express from "express";
import * as Controller from "../product/controller.js"; 
import Validator from "../product/validator.js";
import * as Service from "../product/service.js";
import multer from "multer";



const Productrouter = express.Router(); 

const upload = multer({ storage: multer.memoryStorage() });
Productrouter.post("/products", upload.single('image'), Validator.validateProductCreate, Controller.createProduct);
Productrouter.get("/products", Controller.getProducts);
Productrouter.get("/products/:productId", Controller.getProduct);
Productrouter.get("/products-category", Controller.getProductsByCategory);
Productrouter.delete("/products/:productId", Controller.deleteProduct);
Productrouter.put("/products/:productId", upload.single('image'), Controller.updateProduct); 
Productrouter.get('/active-stock', Controller.getTotalQuantityByBranchAndProduct);



 
export default Productrouter;
