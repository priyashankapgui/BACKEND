import express from 'express';
import Category from './src/modules/category/category.js';
import categoryRouter from './src/modules/category/routes.js';
import { createCategory, getCategory, deleteCategory, updateCategory } from '../category/controller.js';



module.exports = {
  //ProductConstants: constants,

  //ProductService: service,

  CategoryController: controller,

  CategoryRoutes: routes,

  Category: category,
};



