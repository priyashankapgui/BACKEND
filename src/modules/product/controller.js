import express from "express";
import products from "../product/product.js";
import {
  getAllProducts,
  getProductById,
  addProduct,
  searchProductsByName,
  searchProductsByCategoryName,
  deleteProductById,
  updateProductById,
} from "../product/service.js";
import { mapCategoryNameToId } from "../../modules/category/service.js";

// Controller function to get all products
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a product by its ID
export const getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const productbyId = await getProductById(productId);
    if (!productbyId) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(productbyId);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to search products by name
export const getStocksByProductName = async (req, res) => {
  const { productName } = req.params;
  
  try {
    if (!productName) {
      res.status(400).json({ error: "Product name is required" });
      return;
    }
  
    const searchResults = await searchProductsByName(productName);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get products by category name
export const getProductsByCategoryName = async (req, res) => {
  const { categoryName } = req.params;

  try {
    if (!categoryName) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }
  
    const products = await searchProductsByCategoryName(categoryName);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update a product
export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;
  try {
    const updatedProduct = await updateProductById(
      productId,
      updatedProductData
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to create a new product
export const createProduct = async (req, res) => {
  const { productName, price, brand, description, categoryName } = req.body;
  try {
    const categoryId = await mapCategoryNameToId(categoryName);
    const newProduct = await addProduct({
      productName,
      price,
      brand,
      description,
      categoryId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a product
export const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    await deleteProductById(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
