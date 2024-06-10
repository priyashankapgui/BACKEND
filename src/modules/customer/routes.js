import express from "express";
import {
    handleLoginCustomer,
    forgotPasswordCustomer,
    resetPasswordCustomer,
} from "./service.js";
import{
    registerNewCustomer,
    getCustomer,
} from "../customer/controller.js";




const CustomerRouter = express.Router();

CustomerRouter.post("/api/customers/registercustomer", registerNewCustomer);
CustomerRouter.get("/api/customers/:customerId", getCustomer);
CustomerRouter.post("/api/customers/login", handleLoginCustomer);
CustomerRouter.post("/api/customers/login/forgotpw", forgotPasswordCustomer);
CustomerRouter.post("/api/customers/login/forgotpw/resetpw", resetPasswordCustomer);




export default CustomerRouter;