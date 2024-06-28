import sequelize from "./config/database.js";
import express from "express";
import cors from "cors";
import grn from "./src/modules/GRN/grn.js";
import products from "./src/modules/product/product.js";
import suppliers from "./src/modules/supplier/supplier.js";
import categories from "./src/modules/category/category.js";
import branches from "./src/modules/branch/branch.js";
import bill from "./src/modules/bill/bill.js";
import productBatchSum from "./src/modules/productBatchSum/productBatchSum.js";
import Productrouter from "./src/modules/product/routes.js";
import categoryRouter from "./src/modules/category/routes.js";
import EmployeeRouter from './src/modules/employee/routes.js';
import CustomerRouter from './src/modules/customer/routes.js';
import supplierRouter from "./src/modules/supplier/routes.js";
import Branchrouter from "./src/modules/branch/routes.js";
import GRNRouter from "./src/modules/GRN/routes.js";
//import productSupplierRouter from './src/modules/product_Supplier/routes.js';
//import productGRNRouter from "./src/modules/product_GRN/routes.js";
//import branchSupplierRouter from "./src/modules/branch_Supplier/routes.js";
import { setupAssociations } from "./src/modules/associationSetup.js";
import listedProductsRouter from "./src/modules/listedProducts/routes.js";
import productBatchSumrouter from "./src/modules/productBatchSum/routes.js";
import feedback from "./src/modules/feedback/feedback.js";
import feedbackrouter from "./src/modules/feedback/routes.js";
import SuperAdmin from "./src/modules/superAdmin/superAdmin.js";
import PageAccess from "./src/modules/pageAccess/pageAccess.js";
import UserRole from "./src/modules/userRole/userRole.js";
import Permission from "./src/modules/permission/permission.js";
import SuperAdminRouter from "./src/modules/superAdmin/routes.js";
import PermissionRouter from "./src/modules/permission/routes.js";
import UserRoleRouter from "./src/modules/userRole/routes.js";
import PageAccessRouter from "./src/modules/pageAccess/routes.js";
import salesRouter from "./src/modules/sales/routes.js";
import billRouter from "./src/modules/bill/routes.js";
import refundBillRouter from "./src/modules/refund_Bill/routes.js";
import cartRoutes from "./src/modules/cart_Product/routes.js"
import ShoppingCart from "./src/modules/cart_Customer/shoppingcart.js";
import onlineBill from "./src/modules/online_Bill/onlineBill.js";
import onlineBillRoutes from "./src/modules/online_Bill/routes.js";
import onlineBillProductRoutes from "./src/modules/online_Bill_Products/routes.js"
import ProductBatchUpdateReason from "./src/modules/productBatchUpdateReason/productBatchUpdateReason.js";
import productBatchUpdateReasonRouter from "./src/modules/productBatchUpdateReason/routes.js";
import stockTransferRouter from "./src/modules/stockTransfer/routes.js";
import TransferProductBatchRouter from "./src/modules/TransferProductBatch/routes.js";
import TransferProduct from "./src/modules/TransferProduct/TransferProduct.js";
import TransferProductBatch from "./src/modules/TransferProductBatch/TransferProductBatch.js";
import webImagesrouter from "./src/modules/web_Images/routes.js";
import bodyParser from "body-parser";

import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());

app.use(express.json());


app.use("/", Productrouter);
app.use("/", categoryRouter);
app.use("/", supplierRouter);
app.use("/", GRNRouter);
app.use('/', Branchrouter);
app.use('/', EmployeeRouter);
app.use('/', CustomerRouter);
app.use('/', listedProductsRouter);
app.use('/', billRouter);
app.use('/', refundBillRouter);
app.use('/', salesRouter);
app.use('/', feedbackrouter);
app.use('/', productBatchSumrouter);
app.use('/', productBatchSumrouter);
app.use('/', SuperAdminRouter);
app.use('/', PermissionRouter);
app.use('/', UserRoleRouter);
app.use('/', PageAccessRouter)
app.use('/', cartRoutes);
app.use('/',productBatchUpdateReasonRouter);
app.use('/',stockTransferRouter);
app.use('/',TransferProductBatchRouter);
app.use('/',onlineBillRoutes);
app.use('/',onlineBillProductRoutes);
app.use('/',webImagesrouter);


app.use("/api", Productrouter);
app.use("/api", categoryRouter);
app.use("/api", supplierRouter);
app.use("/api", GRNRouter);
app.use('/api', EmployeeRouter);
app.use('/api', CustomerRouter);
app.use('/api', listedProductsRouter);
app.use('/api', billRouter);
app.use('/api', refundBillRouter);
app.use('/api', salesRouter);
app.use('/api', feedback);
app.use('/api', productBatchSumrouter);
app.use('/api', cartRoutes);
app.use('/api',productBatchUpdateReasonRouter);
app.use('/api',stockTransferRouter);
app.use('/api',TransferProductBatchRouter);
app.use('/api',webImagesrouter);




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
            name: item.productName,
            Subtotal:	item.Subtotal,
            Discount:	item.Discount,
            Total:	item.Total
          },
          unit_amount: item.sellingPrice * 100,  
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


export { sequelize, categories, suppliers, grn, products, branches, feedback, ShoppingCart, productBatchSum, SuperAdmin, onlineBill , ProductBatchUpdateReason,bill, TransferProduct, TransferProductBatch};