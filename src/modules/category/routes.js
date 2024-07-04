import express from "express";
import Validator from "../category/validator.js";
import * as Controller from "../category/controller.js";
import multer from "multer";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";

const categoryRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
categoryRouter.post("/categories", authenticateTokenWithPermission('products'), upload.single('image'), Controller.createCategory);
categoryRouter.put("/categories/:categoryId", authenticateTokenWithPermission('products'), upload.single('image'), Controller.updateCategory); 
categoryRouter.get("/categories", authenticateTokenWithPermission('products'), Controller.getCategories);
categoryRouter.get("/categories/:categoryId", authenticateTokenWithPermission('products'), Controller.getCategory);
categoryRouter.delete("/categories/:categoryId", authenticateTokenWithPermission('products'), Controller.deleteCategory);


export default categoryRouter;
