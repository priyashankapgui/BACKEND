import  sequelize from './config/database.js';
import express from "express";
import cors from "cors";
import products from './src/modules/product/product.js';
import Productrouter from './src/modules/product/routes.js';
import categoryRouter from './src/modules/category/routes.js';
import EmployeeRouter from './src/modules/employee/routes.js';
import categories from './src/modules/category/category.js';
import { getProducts } from './src/modules/product/controller.js';
import { getAllProducts} from './src/modules/product/service.js';




const app = express();
app.use(cors());
app.use(express.json());

app.use('/', Productrouter);
app.use('/', categoryRouter);
app.use('/', EmployeeRouter);

app.use('/api', Productrouter);
app.use('/api', categoryRouter);
app.use('/api', EmployeeRouter);

//Category.hasMany(products, {foreignKey: 'categoryId'});
//products.belongsTo(Category, {foreignKey: 'categoryId'});



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





