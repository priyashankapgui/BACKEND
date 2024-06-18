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
import { authenticateToken } from "../../middleware/authenticationMiddleware.js";




const CustomerRouter = express.Router();

CustomerRouter.post("/api/customers/registercustomer", registerNewCustomer);
CustomerRouter.get("/api/customers/:customerId", authenticateToken,getCustomer);
CustomerRouter.put("/api/customers/:customerId",authenticateToken, updateCustomer);
CustomerRouter.post("/api/customers/password/:customerId", authenticateToken,updatePassword)
CustomerRouter.post("/api/customers/login", handleLoginCustomer);
CustomerRouter.post("/api/customers/login/forgotpw", forgotPasswordCustomer);
CustomerRouter.post("/api/customers/login/forgotpw/resetpw", resetPasswordCustomer);




export default CustomerRouter;