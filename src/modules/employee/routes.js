import express from "express";
import {
  getEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from "../employee/controller.js";
import { handleLogin, forgotPassword} from "../employee/service.js";
import { authenticateToken } from "../../middleware/authenticationMiddleware.js";


const EmployeeRouter = express.Router();

EmployeeRouter.get("/employees", authenticateToken,getEmployees);
EmployeeRouter.post("/employees",authenticateToken, createNewEmployee);
EmployeeRouter.get("/employees/:employeeId",authenticateToken, getEmployee);
EmployeeRouter.put("/employees/:employeeId", authenticateToken, updateEmployee);
EmployeeRouter.delete("/employees/:employeeId",authenticateToken, deleteEmployee);
EmployeeRouter.post("/api/login", handleLogin);
EmployeeRouter.post("/api/login/fp", forgotPassword);
EmployeeRouter.post("/api/login/resetpw", resetEmployeePassword);

    
export default EmployeeRouter;
