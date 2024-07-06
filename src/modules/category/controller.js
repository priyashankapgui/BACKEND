import express from "express";
import * as Service from "../category/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";
import cloudinary from "../../blobService/cloudinary.js";

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
  const { categoryName, image } = req.body;
  try {
    let imageUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        // upload_preset: 'flexflow',
        folder: "category",
      });
      imageUrl = uploadRes.secure_url;
    }
    const result = await Service.addCategory({
      categoryName,
      image: imageUrl,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// // Controller function to update a category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updatedCategoryData = { ...req.body };
    if (req.file) {
      console.log("file", req.file);
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "category" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        req.file.stream.pipe(stream);
      });

      updatedCategoryData.image = uploadRes.secure_url;
    } else if (req.body.image) {
      // Handle base64 encoded image upload
      const uploadRes = await cloudinary.uploader.upload(req.body.image, {
        folder: "category",
      });
      updatedCategoryData.image = uploadRes.secure_url;
    }
    const result = await Service.updateCategoryById(
      categoryId,
      updatedCategoryData
    );
    SUCCESS(res, 200, result, req.span);
  } catch (error) {
    console.error(error);
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
