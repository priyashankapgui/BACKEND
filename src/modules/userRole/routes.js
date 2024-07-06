import express from "express";
import {
  getUserRole,
  getUserRoles,
  createUserRole,
  createUserRoleWithPermissions,
  updateUserRoleWithPermissions,
  deleteUserRolWithPermissions,
} from "./controller.js";
import { authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";

const UserRoleRouter = express.Router();

UserRoleRouter.get("/userRole/:userRoleId", getUserRole);
UserRoleRouter.get("/userRoles",authenticateTokenWithPermission('accounts/user-roles'), getUserRoles);
UserRoleRouter.post("/userRoleWithPermissions", authenticateTokenWithPermission('accounts/user-roles'), createUserRoleWithPermissions);
UserRoleRouter.put("/userRoleWithPermissions/:userRoleId", authenticateTokenWithPermission('accounts/user-roles'), updateUserRoleWithPermissions);
UserRoleRouter.delete("/userRoleWithPermissions/:userRoleId", authenticateTokenWithPermission('accounts/user-roles'), deleteUserRolWithPermissions);

export default UserRoleRouter;