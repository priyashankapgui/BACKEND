import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../category/controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/categories", createCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:categoryId", getCategory);
categoryRouter.delete("/categories/:categoryId", deleteCategory);
categoryRouter.put("/categories/:categoryId", updateCategory);

export default categoryRouter;
