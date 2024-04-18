import sequelize from "./config/database.js";
import express from "express";
import products from "./src/modules/product/product.js";
//import productSupplier from './src/modules/product_Supplier/product_Supplier.js';
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import supplierRouter from "./src/modules/supplier/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
import ListedProductsRouter from "./src/modules/listedProducts/routes.js";
//import productSupplierRouter from './src/modules/product_Supplier/routes.js';
import categories from "./src/modules/category/category.js";
import suppliers from "./src/modules/supplier/supplier.js";
import grn from "./src/modules/GRN/grn.js";
import invoices, {setupInvoiceAssociations,} from "./src/modules/invoice/invoice.js";
import { getProducts } from "./src/modules/product/controller.js";
import { getAllProducts } from "./src/modules/product/service.js";
import Category, {setupCategoryAssociations,} from "./src/modules/category/category.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
app.use("/", ListedProductsRouter);
//app.use('/', productSupplierRouter);

app.use("/api", Productrouter);
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
app.use("/api", ListedProductsRouter);
//app.use('/api', productSupplierRouter);




setupCategoryAssociations();
setupInvoiceAssociations();

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

app.listen(8080, () => {
  console.log("Connected to Backend!!");
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

export { sequelize, Category, products };
