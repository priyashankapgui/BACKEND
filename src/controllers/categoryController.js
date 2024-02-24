import express from 'express';
import category from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
    try {
      const createdCategory = await category.create({
        categoryId: '001',
        categoryName: 'Body Wash',
        description: 'This category is for body wash products',
        
      });
      res.json("Category created successfully");
    } catch (err) {
    
      res.json(err);
    }
  };


  export const getCategory = async (req, res) => {
    try {
      const categories = await category.findAll();
      res.json(categories);
    } catch (err) {
      res.json(err);
    }
  };
  
  
  
  export const deleteCategory = async (req, res) => {
      const categoryId = req.params.categoryId;
      try {
        const deletedRowsCount = await category.destroy({
          where: {
            categoryId: 1,
          },
        });
    
        if (deletedRowsCount > 0) {
          res.json("Category has been deleted successfully");
        } else {
          res.json("Category not found");
        }
      } catch (err) {
        res.json(err);
      }
    };
  
  
 
  
  export const updateCategory = async (req, res) => {
      const idCategory = req.params.categoryId;
      const newData = {
        categoryId: '2',
        categoryName: 'Biscuts',
        description: 'This category is for different type of biscuts',
      };
    
      try {
        const [updatedRowsCount] = await products.update(newData, {
          where: {
            categoryId: 1,
    
          },
        });
    
        res.json(`Rows affected: ${updatedRowsCount}`);
      } catch (err) {
        res.json(err);
      }
    };
  





