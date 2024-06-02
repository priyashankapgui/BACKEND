import express from "express";
import {
  getSuperAdmins,
  superAdminLogin,
  superAdminForgotPassword,
  superAdminResetPassword,
  updateSuperAdmin,
} from "./controller.js";
import { authenticateToken } from "../../middleware/authenticationMiddleware.js";

const SuperAdminRouter = express.Router();

SuperAdminRouter.get("/superAdmins", authenticateToken, getSuperAdmins);
SuperAdminRouter.post("/superAdmin/login", superAdminLogin);
SuperAdminRouter.post("/superAdmin/forgotPassword", superAdminForgotPassword);
SuperAdminRouter.post("/superAdmin/resetPassword", superAdminResetPassword);
SuperAdminRouter.put("/superAdmin/update/:superAdminID", authenticateToken, updateSuperAdmin);

export default SuperAdminRouter;
