import express from "express";
import { getPermissionsGroup, verifyPermissions, getUserRolePermissions, getUserRolePermissionsByToken } from "./controller.js";

const PermissionRouter = express.Router();

PermissionRouter.get("/permissionsGroup", getPermissionsGroup);
PermissionRouter.post("/verifyPermissions", verifyPermissions);
PermissionRouter.get("/getUserRolePermissionsByToken", getUserRolePermissionsByToken);
PermissionRouter.get("/getUserRolePermissions/:userRoleId", getUserRolePermissions);

export default PermissionRouter;