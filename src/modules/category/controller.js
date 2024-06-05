import express from "express";
import * as Service from "../category/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";

const { SUC_CODES } = Codes;


// Controller function to get all categories
export const getCategories = async (req, res) => {
  try {
    const result = await Service.getAllCategories(req.query);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};

// Controller function to get a category by its ID
export const getCategory = async (req, res) => {
try {
  const result = await Service.getCategoryById(req.params.categoryId);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};






// Controller function to create a new category
export const createCategory = async (req, res) => {
  try {
    const result = await Service.addCategory(req.body);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    ERROR(res, error, res.span);
  }
};



// Controller function to update a category
export const updateCategory = async (req, res) => {
try {
  const result = await Service.updateCategoryById(req.params.categoryId, req.body);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};



// Controller function to delete a category
export const deleteCategory = async (req, res) => {
try {
  const result = await Service.deleteCategoryById(req.params.categoryId);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};
