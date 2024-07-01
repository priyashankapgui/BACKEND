import express from "express";
import {
  getEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
  updatePersonalInfo,
  loginEmployee,
  logoutEmployee,
  forgotPassword,
  updatePassword,
} from "../employee/controller.js";
import {  imageUploadTest } from "../employee/service.js";
import { authenticateToken, authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";
import { processForm,  processMultipleForm } from "../../blobService/utils.js";


const EmployeeRouter = express.Router();

EmployeeRouter.get("/employees", authenticateTokenWithPermission('accounts'), getEmployees);
EmployeeRouter.post("/employees",authenticateTokenWithPermission('accounts'), processForm(), createNewEmployee);
EmployeeRouter.get("/employees/:employeeId",authenticateTokenWithPermission('accounts'), getEmployee);
EmployeeRouter.put("/employees/:employeeId",authenticateTokenWithPermission('accounts'), processForm(), updateEmployee);
EmployeeRouter.post("/employees/selfUpdate", processForm(), updatePersonalInfo);
EmployeeRouter.post("/employees/updatePw", updatePassword);
EmployeeRouter.delete("/employees/:employeeId",authenticateTokenWithPermission('accounts'), deleteEmployee);
EmployeeRouter.post("/api/login", loginEmployee);
EmployeeRouter.post("/api/login/fp", forgotPassword);
EmployeeRouter.post("/api/login/resetpw", resetEmployeePassword);
EmployeeRouter.post("/api/logout", authenticateToken, logoutEmployee);
EmployeeRouter.post("/imageupload", processMultipleForm(), imageUploadTest);




    
export default EmployeeRouter;
