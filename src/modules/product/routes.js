import express from "express";
import * as Controller from "../product/controller.js"; 
import Validator from "../product/validator.js";
import * as Service from "../product/service.js";
import { processForm,  processMultipleForm } from "../../blobService/utils.js";


const Productrouter = express.Router(); 

Productrouter.post("/products" ,  processMultipleForm(), Controller.createProduct);
Productrouter.post("/imageupload", processMultipleForm(), Service.imageUploadTest);
Productrouter.get("/products", Controller.getProducts);
Productrouter.get("/products/:productId", Controller.getProduct);
Productrouter.get("/products-category", Controller.getProductsByCategory);
Productrouter.delete("/products/:productId", Controller.deleteProduct);
Productrouter.put("/products/:productId", Validator.validateProductUpdate, Controller.updateProduct);
Productrouter.get('/active-stock', Controller.getTotalQuantityByBranchAndProduct);



 
export default Productrouter;
