import express from "express";
import Validator from "../category/validator.js";
import * as Controller from "../category/controller.js";
import multer from "multer";

const categoryRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
categoryRouter.post("/categories", upload.single('image'), Controller.createCategory);
categoryRouter.put("/categories/:categoryId", upload.single('image'), Controller.updateCategory); 
categoryRouter.get("/categories", Controller.getCategories);
categoryRouter.get("/categories/:categoryId", Controller.getCategory);
categoryRouter.delete("/categories/:categoryId", Controller.deleteCategory);


export default categoryRouter;
