// import  sequelize  from '../../../config/database.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
  handleEmployeeResetPassword,
  getEmployeesByBranch,
  updateEmployeePersonalInfo,
  handleLogin,
  forgotPasswordService
} from "../employee/service.js";
import { SECRET } from "../../../config/config.js";
import jwt, { decode } from "jsonwebtoken";
import { handleSuperAdminResetPassword, updateSuperAdminById } from "../superAdmin/service.js";
import Employee from "./employee.js";
import SuperAdmin from "../superAdmin/superAdmin.js";
const ACCESS_TOKEN = SECRET.SECRET_KEY;

export const getEmployees = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    const userRoleId = decoded.userRoleId;
    const branchName = decoded.branchName;
    if(userRoleId === 1 && !branchName){
      const employees = await getAllEmployees();
      res.status(200).json(employees);
    }
    else{
      const employees = await getEmployeesByBranch(branchName);
      res.status(200).json(employees);
    }
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
  try {
    const newEmployee = await createEmployee(req);
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
  const role = decoded.userRoleId;
  const branch = decoded.branchName;
  const employeeId = req.params.employeeId;
  const updatedEmployeeData = JSON.parse(req.body.data); 
  
  try {
    const updatedEmployee = await updateEmployeeById(
      req,
      employeeId,
      updatedEmployeeData,
      role,
      branch
    );
    if (!updatedEmployee) {
      res.status(404).json({ error: "Couldn't Update" });
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

export const updatePersonalInfo = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    const employeeId = decoded.employeeId || decoded.userID;
    const updatedEmployeeData = JSON.parse(req.body.data);;
    console.log(updatedEmployeeData, employeeId);
    let updatedEmployee;
    if(employeeId.startsWith("SA")){
      updatedEmployeeData.superAdminName = updatedEmployeeData.employeeName;
      updatedEmployee = await updateSuperAdminById(req, employeeId, updatedEmployeeData);
    }
    else{
      updatedEmployee = await updateEmployeePersonalInfo(req, employeeId, updatedEmployeeData);
    }
    if (!updatedEmployee) {
      res.status(404).json({ error: "Couldn't Update" });
      return;
    }
    res.status(200).json(updatedEmployee);
  } 
  catch (error) {
    if(error.message === "Unauthorized"){
      res.status(403).json({ error: error.message });
    }
    else{
    res.status(500).json({ error: error.message });
    }
  }
}

export const deleteEmployee = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, ACCESS_TOKEN);
  const role = decoded.role || decoded.userRoleId;
  const branch = decoded.branchName;
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

export const loginEmployee = async (req, res) => {
  const { employeeId, password } = req.body;
  if (!employeeId || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const data = await handleLogin(employeeId, password);
    res.status(200).json(data);
  } 
  catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export const forgotPassword = async (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId) {
    res.status(400).json({ message: "employee ID is required" });
    return;
  }
  try {
    const data = await forgotPasswordService(employeeId);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export const resetEmployeePassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;
  if (!resetToken || !newPassword || !confirmPassword) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  if(newPassword !== confirmPassword){
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }
  if(newPassword.length < 8 || newPassword.length > 64){
    res.status(400).json({ message: "Invalid password format" });
    return;
  }
  // const decoded = jwt.verify(resetToken, ACCESS_TOKEN);
  // console.log(decoded);
  let decoded;
  try{
    decoded = jwt.verify(resetToken, ACCESS_TOKEN);
  }
  catch(error){
    return res.status(401).json({ message: "This link is invalid or has expired" });
  }
  const userId = decoded.userId;
  try {
    if(userId.startsWith("SA")){
      handleSuperAdminResetPassword(userId, newPassword);
    }
    else{
      handleEmployeeResetPassword(userId, newPassword);
    }
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof TypeError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export const logoutEmployee = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    const employeeId = decoded.employeeId || decoded.userID;
    if (employeeId.startsWith("SA")){
      await SuperAdmin.update({ currentAccessToken: null }, { where: { superAdminId: employeeId } });
    } else {
      await Employee.update({ currentAccessToken: null }, { where: { employeeId: employeeId } });
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}