import express from "express";
import {
  getEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../employee/controller.js";
import { handleLogin, forgotPassword,passwordReset } from "../employee/service.js";
import { getAllEmployees } from "../employee/service.js";
import { authenticateToken } from "../../middleware/authenticationMiddleware.js";
//import { reset } from "nodemon";

const EmployeeRouter = express.Router();

EmployeeRouter.get("/employees", getEmployees);
EmployeeRouter.post("/employees", createNewEmployee);
EmployeeRouter.get("/employees/:employeeId", getEmployee);

//EmployeeRouter.put('/employees/:employeeId', updateEmployee);

//check if authenticateToken is working
EmployeeRouter.put("/employees/:employeeId", authenticateToken, updateEmployee);
EmployeeRouter.delete("/employees/:employeeId", deleteEmployee);
EmployeeRouter.post("/api/login", handleLogin);
EmployeeRouter.post("/api/login/fp", forgotPassword);
EmployeeRouter.post("/api/login/resetpw", passwordReset);

export default EmployeeRouter;
