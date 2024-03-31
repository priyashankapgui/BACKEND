import  sequelize from './config/database.js';
import express from "express";
import products from './src/modules/product/product.js';
import Productrouter from './src/modules/product/routes.js';
import categoryRouter from './src/modules/category/routes.js';
import supplierRouter from './src/modules/supplier/routes.js';
import stockRouter from './src/modules/stock/routes.js';
import categories from './src/modules/category/category.js';
import suppliers from './src/modules/supplier/supplier.js';
import { getProducts } from './src/modules/product/controller.js';
import { getAllProducts} from './src/modules/product/service.js';
import Category, { setupCategoryAssociations } from './src/modules/category/category.js';
import feedbackrouter from './src/modules/feedback/routes.js';
import feedback from './src/modules/feedback/feedback.js';
import cors from 'cors';
import Branchrouter from './src/modules/branch/routes.js';
import Branch from './src/modules/branch/branch.js'




const app = express();
app.use(cors());

app.use(express.json());

app.use('/', Productrouter);
app.use('/', categoryRouter);
app.use('/', supplierRouter);
app.use('/', stockRouter);
app.use('/',Branchrouter);
app.use('/', feedbackrouter);

app.use('/api', Productrouter);
app.use('/api', categoryRouter);
app.use('/api', supplierRouter);
app.use('/api', stockRouter);
app.use('/api',Branch);
app.use('/api',feedbackrouter);



setupCategoryAssociations();



sequelize.sync()
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


export { sequelize, Category, products ,feedback};


