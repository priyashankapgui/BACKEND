import express from "express";
import * as Controller from "../product/controller.js"; 
import Validator from "../product/validator.js";
import multer from "multer";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";



const Productrouter = express.Router(); 

const upload = multer({ storage: multer.memoryStorage() });
Productrouter.post("/products", authenticateTokenWithPermission('products'), upload.single('image'), Validator.validateProductCreate, Controller.createProduct);
Productrouter.get("/products", Controller.getProducts);
Productrouter.get("/products/:productId",  Controller.getProduct);
Productrouter.get("/products-category", authenticateTokenWithPermission('products'), Controller.getProductsByCategory);
Productrouter.delete("/products/:productId", authenticateTokenWithPermission('products'), Controller.deleteProduct);
Productrouter.put("/products/:productId", authenticateTokenWithPermission('products'), upload.single('image'), Controller.updateProduct); 
Productrouter.get('/active-stock', authenticateTokenWithPermission('stock-balance'), Controller.getTotalQuantityByBranchAndProduct);
Productrouter.get('/products-by-category-and-branch', Controller.getProductAndBatchSumDetailsController);



 
export default Productrouter;
