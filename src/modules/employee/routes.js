import express from "express";
import {
  getEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../employee/controller.js";
import { handleLogin, forgotPassword,passwordReset,verify,verifyAdmin , verifySuperAdmin} from "../employee/service.js";
import { authenticateToken } from "../../middleware/authenticationMiddleware.js";


const EmployeeRouter = express.Router();

EmployeeRouter.get("/employees", authenticateToken,getEmployees);
EmployeeRouter.post("/employees",authenticateToken, createNewEmployee);
EmployeeRouter.get("/employees/:employeeId",authenticateToken, getEmployee);
EmployeeRouter.put("/employees/:employeeId", authenticateToken, updateEmployee);
EmployeeRouter.delete("/employees/:employeeId",authenticateToken, deleteEmployee);
EmployeeRouter.post("/api/login", handleLogin);
EmployeeRouter.post("/api/login/fp", forgotPassword);
EmployeeRouter.post("/api/login/resetpw", passwordReset);

// EmployeeRouter.get("/api/employees/verify", authenticateToken, (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "User Verified",
//     });
// });

EmployeeRouter.get("/api/employees/verify", authenticateToken,verify);


EmployeeRouter.get("/api/employees/verifyAdmin", authenticateToken,verifyAdmin);
EmployeeRouter.get("/api/employees/verifySuperAdmin", authenticateToken,verifySuperAdmin);
    
export default EmployeeRouter;
