import  sequelize from './config/database.js';
import express from "express";
import products from './src/models/productModel.js';
import productRoutes from './src/routes/productRoutes.js';
import { createProduct, getProducts, deleteProduct, updateProduct } from './src/controllers/productControllers.js';
import category from './src/models/categoryModel.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import {createCategory, getCategory, deleteCategory, updateCategory} from './src/controllers/categoryController.js';


const app = express();

app.use(express.json());

app.use('/products', productRoutes);
app.use('/category', categoryRoutes);

app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

category.hasMany(products, {foreignKey: 'categoryId'});
products.belongsTo(category, {foreignKey: 'categoryId'});



sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });



  app.listen(8080, () => {
  console.log("Connected to Backend!!");
});


process.on('SIGINT', () => {
  sequelize.close()
    .then(() => {
      console.log('Connection closed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error closing Sequelize connection:', err);
      process.exit(1);
    });
});





