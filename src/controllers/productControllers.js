import express from 'express';
import products from '../models/productModel.js';

  export const createProduct = async (req, res) => {
      try {
        const createdProduct = await products.create({
          productId: '002',
          productName: 'Sunsilk Soft and Smooth Shampoo',
          price: 600.00,
          size: '180ml',
        });
        res.json("Product created successfully");
      } catch (err) {
        res.json(err);
      }
    };
    

  
export const getProducts = async (req, res) => {
    try {
      const product = await products.findAll();
      res.json(product);
    } catch (err) {
      res.json(err);
    }
  };
  
  
  
  export const deleteProduct = async (req, res) => {
      const productId = req.params.productId;
      try {
        const deletedRowsCount = await products.destroy({
          where: {
            productId: '002',
          },
        });
    
        if (deletedRowsCount > 0) {
          res.json("Product has been deleted successfully");
        } else {
          res.json("Product not found");
        }
      } catch (err) {
        res.json(err);
      }
    };
  
  
 
  
  export const updateProduct = async (req, res) => {
      const idProducts = req.params.productId;
      const newData = {
        productId: '003',
        productName: 'Scan',
        price: 2000.00,
        size: '10g',
      };
    
      try {
        const [updatedRowsCount] = await products.update(newData, {
          where: {
            productId: '002',
    
          },
        });
    
        res.json(`Rows affected: ${updatedRowsCount}`);
      } catch (err) {
        res.json(err);
      }
    };
  


 