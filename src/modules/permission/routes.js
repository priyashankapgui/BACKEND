import express from "express";
import { getPermissionsGroup, verifyPermissions, getUserRolePermissions } from "./controller.js";

const PermissionRouter = express.Router();

PermissionRouter.get("/permissionsGroup", getPermissionsGroup);
PermissionRouter.post("/verifyPermissions", verifyPermissions);
PermissionRouter.get("/getUserRolePermissions/:userRoleId", getUserRolePermissions);

export default PermissionRouter;