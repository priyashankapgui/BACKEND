import sequelize from "./config/database.js";
import express from "express";
import cors from "cors"; 
import grn from "./src/modules/GRN/grn.js";
import dotenv from "./config/database.js";
import products from "./src/modules/product/product.js";
import suppliers from "./src/modules/supplier/supplier.js";
import categories from "./src/modules/category/category.js";
import branches from "./src/modules/branch/branch.js";
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import EmployeeRouter from './src/modules/employee/routes.js';
import CustomerRouter from './src/modules/customer/routes.js';
import supplierRouter from "./src/modules/supplier/routes.js";
import Branchrouter from "./src/modules/branch/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
import productSupplierRouter from './src/modules/product_Supplier/routes.js';
import productGRNRouter from "./src/modules/product_GRN/routes.js";
import branchSupplierRouter from "./src/modules/branch_Supplier/routes.js";
import { setupAssociations } from "./src/modules/associationSetup.js";
import listedProductsRouter from "./src/modules/listedProducts/routes.js";
import billRouter from "./src/modules/bill/routes.js";
import feedback from "./src/modules/feedback/feedback.js";
import feedbackrouter from "./src/modules/feedback/routes.js";



 
const app = express();
 
app.use(cors());

app.use(express.json());  
  
app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
app.use('/', productSupplierRouter);
app.use('/', productGRNRouter);
app.use('/', Branchrouter);
app.use('/', branchSupplierRouter);
app.use('/', EmployeeRouter);
app.use('/', CustomerRouter)
app.use('/', listedProductsRouter);
app.use('/', billRouter);
app.use('/', feedbackrouter);




app.use("/api", Productrouter);  
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
app.use('/api', productSupplierRouter);
app.use('/api', EmployeeRouter);
app.use('/api', CustomerRouter);
app.use('/api', productGRNRouter);
app.use('/api', listedProductsRouter);
app.use('/api', billRouter);
app.use('/api', feedback);



app.use('/Images', express.static('.src/Images'))

setupAssociations();




sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("Database synchronized");
    app.listen(8080, () => {
      console.log("Connected to Backend!!");
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });


process.on("SIGINT", () => {
  sequelize
    .close()
    .then(() => {
      console.log("Connection closed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing Sequelize connection:", err);
      process.exit(1);
    });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});




 export { sequelize, categories, suppliers, grn, products, branches,feedback };