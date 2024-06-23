import express from "express";
import {
    resetPasswordCustomer,
} from "./service.js";
import{
    registerNewCustomer,
    getCustomer,
    handleLoginCustomer,
    forgotPasswordCustomer,
    updateCustomer,
    updatePassword
} from "../customer/controller.js";
import {authenticateCustomerToken } from "../../middleware/authenticationMiddleware.js";




const CustomerRouter = express.Router();

CustomerRouter.post("/api/customers/registercustomer", registerNewCustomer);
CustomerRouter.get("/api/customers/:customerId", authenticateCustomerToken,getCustomer);
CustomerRouter.put("/api/customers/:customerId",authenticateCustomerToken, updateCustomer);
CustomerRouter.post("/api/customers/password/:customerId", authenticateCustomerToken,updatePassword)
CustomerRouter.post("/api/customers/login", handleLoginCustomer);
CustomerRouter.post("/api/customers/login/forgotpw", forgotPasswordCustomer);
CustomerRouter.post("/api/customers/login/forgotpw/resetpw", resetPasswordCustomer);




export default CustomerRouter;