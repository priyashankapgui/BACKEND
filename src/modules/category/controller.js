import express from 'express';
import { addCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } from '../category/service.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const createCategory = async (req, res) => {
  try {
    const newCategory = await addCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const updatedCategoryData = req.body;
  try {
    const updatedCategory = await updateCategoryById(categoryId, updatedCategoryData);
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    await deleteCategoryById(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};














  
    
    
    
    


