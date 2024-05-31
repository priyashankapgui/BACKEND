import express from "express";
import { getPermissionsGroup, verifyPermissions } from "./controller.js";

const PermissionRouter = express.Router();

PermissionRouter.get("/permissionsGroup", getPermissionsGroup);
PermissionRouter.post("/verifyPermissions", verifyPermissions);

export default PermissionRouter;