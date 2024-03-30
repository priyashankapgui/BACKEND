import express from 'express';
import {getEmployees,getEmployee,createNewEmployee,updateEmployee,deleteEmployee,handleLogin } from '../employee/controller.js';
import {getAllEmployees} from '../employee/service.js';



const EmployeeRouter = express.Router();

// EmployeeRouter.get('/employee', test);
EmployeeRouter.get('/employees', getEmployees);
EmployeeRouter.post('/employees', createNewEmployee);
EmployeeRouter.get('/employees/:employeeId', getEmployee);
EmployeeRouter.put('/employees/:employeeId', updateEmployee);
EmployeeRouter.delete('/employees/:employeeId', deleteEmployee);
EmployeeRouter.post('/api/login', handleLogin);



export default EmployeeRouter;
