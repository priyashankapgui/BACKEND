import Employee from "./employee";
import EmployeeRouter from "./src/modules/employee/routes.js";
import { getEmployees } from "../employee/controller.js";
// import { getAllEmployees } from "../employee/service.js";


module.exports = {
    EmployeeConstants:constants,
    EmployeeService:service,
    EmployeeController:controller,
    EmployeeRoutes:routes,
    Employee:Employee,
};
