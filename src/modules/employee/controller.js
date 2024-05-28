// import  sequelize  from '../../../config/database.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
} from "../employee/service.js";
import { SECRET } from "../../../config/config.js";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN = SECRET.SECRET_KEY;

export const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const employee = await getEmployeeById(employeeId);
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewEmployee = async (req, res) => {
  const employee = req.body;
  try {
    const newEmployee = await createEmployee(employee);
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, ACCESS_TOKEN);
  const role = decoded.role;
  const branch = decoded.branchName;
  const employeeId = req.params.employeeId;
  const updatedEmployeeData = req.body;
  try {
    const updatedEmployee = await updateEmployeeById(
      employeeId,
      updatedEmployeeData,
      role,
      branch
    );
    if (!updatedEmployee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    if(error.message === "Unauthorized"){
      res.status(403).json({ error: error.message });
    }
    else{
    res.status(500).json({ error: error.message });
    }
  }
};

export const deleteEmployee = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, ACCESS_TOKEN);
  const role = decoded.role;
  const branch = decoded.branchName;
  if (role != "superadmin" && role != "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const employeeId = req.params.employeeId;
  try {
    const deletedEmployee = await deleteEmployeeById(employeeId, role, branch);
    if (!deletedEmployee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    if(error.message === "Unauthorized"){
      res.status(403).json({ error: error.message });
    }
    else{
      res.status(500).json({ error: error.message });
    }
  }
};

