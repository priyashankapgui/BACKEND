import express from "express";
import {
  getUserRole,
  getUserRoles,
  createUserRole,
  createUserRoleWithPermissions,
  updateUserRoleWithPermissions,
  deleteUserRolWithPermissions,
} from "./controller.js";

const UserRoleRouter = express.Router();

UserRoleRouter.get("/userRole/:userRoleId", getUserRole);
UserRoleRouter.get("/userRoles", getUserRoles);
UserRoleRouter.post("/userRole", createUserRole);
UserRoleRouter.post("/userRoleWithPermissions", createUserRoleWithPermissions);
UserRoleRouter.put("/userRoleWithPermissions/:userRoleId", updateUserRoleWithPermissions);
UserRoleRouter.delete("/userRoleWithPermissions/:userRoleId", deleteUserRolWithPermissions);

export default UserRoleRouter;