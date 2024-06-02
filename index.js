import sequelize from "./config/database.js";
import express from "express";
import cors from "cors"; 
import grn from "./src/modules/GRN/grn.js";
import dotenv from "./config/database.js";
import products from "./src/modules/product/product.js";
import suppliers from "./src/modules/supplier/supplier.js";
import categories from "./src/modules/category/category.js";
import branches from "./src/modules/branch/branch.js";
import SuperAdmin from "./src/modules/superAdmin/superAdmin.js";
import PageAccess from "./src/modules/pageAccess/pageAccess.js";
import UserRole from "./src/modules/userRole/userRole.js";
import Permission from "./src/modules/permission/permission.js";
import productBatchSum from "./src/modules/productBatchSum/productBatchSum.js";
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import EmployeeRouter from './src/modules/employee/routes.js';
import CustomerRouter from './src/modules/customer/routes.js';
import supplierRouter from "./src/modules/supplier/routes.js";
import Branchrouter from "./src/modules/branch/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
//import productSupplierRouter from './src/modules/product_Supplier/routes.js';
import productGRNRouter from "./src/modules/product_GRN/routes.js";
//import branchSupplierRouter from "./src/modules/branch_Supplier/routes.js";
import { setupAssociations } from "./src/modules/associationSetup.js";
import listedProductsRouter from "./src/modules/listedProducts/routes.js";
import productBatchSumrouter from "./src/modules/productBatchSum/routes.js";
import billRouter from "./src/modules/bill/routes.js";
import feedback from "./src/modules/feedback/feedback.js";
import feedbackrouter from "./src/modules/feedback/routes.js";
import SuperAdminRouter from "./src/modules/superAdmin/routes.js";
import cartProductRoutes from "./src/modules/cart_Product/routes.js"
import ShoppingCart from "./src/modules/Cart_Customer/shoppingcart.js";
import PermissionRouter from "./src/modules/permission/routes.js";
import UserRoleRouter from "./src/modules/userRole/routes.js";
import Stripe from 'stripe';
import PageAccessRouter from "./src/modules/pageAccess/routes.js";



 
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(cors());

app.use(express.json());  
  
app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
//app.use('/', productSupplierRouter);
app.use('/', productGRNRouter);
app.use('/', Branchrouter);
//app.use('/', branchSupplierRouter);
app.use('/', EmployeeRouter);
app.use('/', CustomerRouter)
app.use('/', listedProductsRouter);
app.use('/', billRouter);
app.use('/', feedbackrouter);
app.use('/', cartProductRoutes);
app.use('/',productBatchSumrouter);app.use('/', SuperAdminRouter);
app.use('/', PermissionRouter);
app.use('/', UserRoleRouter);
app.use('/', PageAccessRouter)



app.use("/api", Productrouter);  
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
//app.use('/api', productSupplierRouter);
app.use('/api', EmployeeRouter);
app.use('/api', CustomerRouter);
app.use('/api', productGRNRouter);
app.use('/api', listedProductsRouter);
app.use('/api', billRouter);
app.use('/api', feedback);
app.use('/api', cartProductRoutes);
app.use('/api',productBatchSumrouter);


app.use('/Images', express.static('.src/Images'))

setupAssociations();




sequelize.sync() 
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

// Stripe Checkout Session Route
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'lkr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


 export { sequelize, categories, suppliers, grn, products, branches,feedback, SuperAdmin,ShoppingCart, productBatchSum};