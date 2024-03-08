import express from 'express';
import products from '../product/product.js';
import { getAllProducts, getProductById, addProduct , deleteProductById, updateProductById } from '../product/service.js';


export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const productbyId  = await getProductById(productId);
    if (!productbyId ) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(200).json(productbyId );
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 


export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;
  try {
    const updatedProduct = await updateProductById(productId, updatedProductData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const createProduct = async (req, res) => {
  
    const { productName, price, size, brand, description, categoryId } = req.body;
  try { 
    const newProduct = await addProduct({ productName, price, size, brand, description, categoryId });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    await deleteProductById(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




