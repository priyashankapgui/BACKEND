import sequelize from "../../config/database.js"
import app from "../router.js";

import branches from "../modules/branch/branch.js";
import bill from "../modules/bill/bill.js";
import ShoppingCart from "../modules/cart_Customer/shoppingcart.js";
//import bill_Product from "../modules/bill_Product/bill_Product.js";
import cart_Product from "../modules/cart_Product/cartProduct.js";
import categories from "../modules/category/category.js";
import Customer from "../modules/customer/customer.js";
import Employee from "../modules/employee/employee.js";
import feedback from "../modules/feedback/feedback.js";
import grn from "../modules/GRN/grn.js";
import products from "../modules/product/product.js";
import productBatchSum from "../modules/productBatchSum/productBatchSum.js";
import productGRN from "../modules/product_GRN/product_GRN.js";
import suppliers from "../modules/supplier/supplier.js";
 

export default async function generateTables() { 
    try { 
      await sequelize.sync({ alter: true });
  
      console.log("Database synchronized");
      app.listen(8080, () => {
        console.log("Connected to Backend!!");
      });
    } catch (err) {
      console.error("Error synchronizing database:", err);
    }
  
    process.on("SIGINT", async () => {
      try {
        await sequelize.close();
        console.log("Connection closed.");
        process.exit(0);
      } catch (err) {
        console.error("Error closing Sequelize connection:", err);
        process.exit(1);
      }
    });
  
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
    });
  }

