import express from "express";
import Validator from "../category/validator.js";
import * as Controller from "../category/controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/categories", Validator.create, Controller.createCategory);
categoryRouter.get("/categories", Controller.getCategories);
categoryRouter.get("/categories/:categoryId", Controller.getCategory);
categoryRouter.delete("/categories/:categoryId", Controller.deleteCategory);
categoryRouter.put("/categories/:categoryId", Validator.update, Controller.updateCategory);

export default categoryRouter;
