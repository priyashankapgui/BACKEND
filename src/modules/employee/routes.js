import express from "express";
import {
  getEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
  updatePersonalInfo,
} from "../employee/controller.js";
import { handleLogin, forgotPassword} from "../employee/service.js";
import { authenticateToken, authenticateTokenWithPermission } from "../../middleware/authenticationMiddleware.js";


const EmployeeRouter = express.Router();

EmployeeRouter.get("/employees", authenticateTokenWithPermission('accounts'), getEmployees);
EmployeeRouter.post("/employees",authenticateTokenWithPermission('accounts'), createNewEmployee);
EmployeeRouter.get("/employees/:employeeId",authenticateTokenWithPermission('accounts'), getEmployee);
EmployeeRouter.put("/employees/:employeeId",authenticateTokenWithPermission('accounts'), updateEmployee);
EmployeeRouter.post("/employees/selfUpdate", updatePersonalInfo)
EmployeeRouter.delete("/employees/:employeeId",authenticateTokenWithPermission('accounts'), deleteEmployee);
EmployeeRouter.post("/api/login", handleLogin);
EmployeeRouter.post("/api/login/fp", forgotPassword);
EmployeeRouter.post("/api/login/resetpw", resetEmployeePassword);

    
export default EmployeeRouter;
