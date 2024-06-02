import express from "express";
import * as categoryService from "../category/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";

const { SUC_CODES } = Codes;


// Controller function to get all categories
export const getCategories = async (req, res) => {
  try {
    const categoryReq = await categoryService.getAllCategories();
    // SUCCESS(res, SUC_CODES, result, req.span);
    res.status(200).json(categoryReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a category by its ID
export const getCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to create a new category
export const createCategory = async (req, res) => {
  try {
    const result = await categoryService.addCategory(req.body);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    ERROR(res, error, res.span);
  }
};

// Controller function to update a category
export const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const updatedCategoryData = req.body;
  try {
    const updatedCategory = await categoryService.updateCategoryById(
      categoryId,
      updatedCategoryData
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a category
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId; 
  try {
    await categoryService.deleteCategoryById(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
