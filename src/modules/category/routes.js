import express from "express";
import Validator from "../category/validator.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../category/controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/categories", Validator.create, createCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:categoryId", getCategory);
categoryRouter.delete("/categories/:categoryId", deleteCategory);
categoryRouter.put("/categories/:categoryId", Validator.update, updateCategory);

export default categoryRouter;
