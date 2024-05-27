import sequelize from "./config/database.js";
import express from "express";
import cors from "cors"; 
import dotenv from "dotenv";
import products from "./src/modules/product/product.js";
import productSupplier from './src/modules/product_Supplier/product_Supplier.js';
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import EmployeeRouter from './src/modules/employee/routes.js';
import feedbackRouter from './src/modules/feedback/routes.js';
import supplierRouter from "./src/modules/supplier/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
import productSupplierRouter from './src/modules/product_Supplier/routes.js';
import suppliers from "./src/modules/supplier/supplier.js";
import grn from "./src/modules/GRN/grn.js";
import feedback from "./src/modules/feedback/feedback.js";
import { getProducts } from "./src/modules/product/controller.js";
import { getAllProducts } from "./src/modules/product/service.js";
import categories from "./src/modules/category/category.js";
import { setupAssociations } from "./src/modules/associationSetup.js";
import Branchrouter from "./src/modules/branch/routes.js";
import branchSupplierRouter from "./src/modules/branch_Supplier/routes.js";
import branches from "./src/modules/branch/branch.js";
import cartProductRoutes from "./src/modules/cart_Product/routes.js"
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
dotenv.config();

app.use(express.json());  

app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
app.use('/', productSupplierRouter);
app.use('/', Branchrouter);
app.use('/', feedbackRouter);
app.use('/', branchSupplierRouter);
app.use('/', EmployeeRouter);
app.use('/', cartProductRoutes);

app.use("/api", Productrouter);  
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
app.use("/api", feedbackRouter);
app.use('/api', productSupplierRouter);
app.use('/api', EmployeeRouter);
app.use("/api", cartProductRoutes);


app.use('/Images', express.static('.src/Images'))



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


export { sequelize, categories, suppliers, grn, feedback, products, branches };