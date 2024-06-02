import express from "express";
import {
  getUserRole,
  getUserRoles,
  createUserRole,
  createUserRoleWithPermissions,
} from "./controller.js";

const UserRoleRouter = express.Router();

UserRoleRouter.get("/userRole/:userRoleId", getUserRole);
UserRoleRouter.get("/userRoles", getUserRoles);
UserRoleRouter.post("/userRole", createUserRole);
UserRoleRouter.post("/userRoleWithPermissions", createUserRoleWithPermissions);

export default UserRoleRouter;