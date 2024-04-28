import sequelize from "./config/database.js";
import express from "express";
import products, {setupProductGRNAssociations} from "./src/modules/product/product.js";
import productSupplier from './src/modules/product_Supplier/product_Supplier.js';
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import supplierRouter from "./src/modules/supplier/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
import productSupplierRouter from './src/modules/product_Supplier/routes.js';
//import categories from "./src/modules/category/category.js";
import suppliers, {setupProductSupplierAssociations} from "./src/modules/supplier/supplier.js";
import grn from "./src/modules/GRN/grn.js";
//import invoices, {setupInvoiceAssociations,} from "./src/modules/invoice/invoice.js";
import { getProducts } from "./src/modules/product/controller.js";
import { getAllProducts } from "./src/modules/product/service.js";
import categories, {setupCategoryAssociations} from "./src/modules/category/category.js";
import cors from "cors"; 
import productGRNRouter from "./src/modules/product_GRN/routes.js";
import { setupAssociations } from "./src/modules/associationSetup.js";
 
const app = express();
 
app.use(cors());

app.use(express.json());  
  
app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
app.use('/', productSupplierRouter);
app.use('/', productGRNRouter);

app.use("/api", Productrouter);  
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
app.use('/api', productSupplierRouter);
app.use('/api', productGRNRouter);

app.use('/Images', express.static('.src/Images'))

setupCategoryAssociations();
//setupInvoiceAssociations();
setupProductSupplierAssociations();
setupProductGRNAssociations();
//setupGRNSUPPLIERAssociations();

setupAssociations();


sequelize.sync({ alter: true }) // Using { alter: true } to automatically alter tables based on model changes
  .then(() => {
    console.log("Database synchronized");
    // Start your express server once the database is synchronized
    app.listen(8080, () => {
      console.log("Connected to Backend!!");
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// Handle graceful shutdown
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});


// sequelize 
//   .sync()
//   .then(() => {
//     console.log("Database synchronized");
//   })
//   .catch((err) => {
//     console.error("Error synchronizing database:", err);
//   });

// app.listen(8080, () => {
//   console.log("Connected to Backend!!");
// });

// process.on("SIGINT", () => {
//   sequelize
//     .close()
//     .then(() => {
//       console.log("Connection closed.");
//       process.exit(0);
//     })
//     .catch((err) => {
//       console.error("Error closing Sequelize connection:", err);
//       process.exit(1);
//     });
// });

 export { sequelize, categories, suppliers, grn, products };
