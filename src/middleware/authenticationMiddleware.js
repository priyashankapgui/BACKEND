import jwt from "jsonwebtoken";
import { SECRET } from "../../config/config.js";
const { SECRET_KEY } = SECRET;
import Permission from "../modules/permission/permission.js";
import SuperAdmin from "../modules/superAdmin/superAdmin.js";
import Employee from "../modules/employee/employee.js";
import Customer from "../modules/customer/customer.js";

export const authenticateToken = async(req, res, next) => {
  try{
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(!token){
      res.status(400).json({ error: "Token Missing" });
    }
    let decoded;
    try{
      decoded = jwt.verify(token, SECRET_KEY);
    }
    catch(error){
      res.status(401).json({ error: "Token Expired. Please Login Again" });
      return;
    }
    const userId = decoded.userID || decoded.employeeId;
    let userRow;
    if(userId.startsWith("SA")){
      userRow = await SuperAdmin.findOne({where: {superAdminId: userId}, attributes: ['currentAccessToken']});
    }
    else{
      userRow = await Employee.findOne({where: {employeeId: userId}, attributes: ['currentAccessToken']});
    }
    if(userRow.currentAccessToken !== token){
      res.status(401).json({ error: "Token Error" });
    }
    else{
      next();
    }
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
};

export function authenticateTokenWithPermission(pageId){
  return async function(req, res, next){
    try{
      const authHeader = req.headers["authorization"];
      console.log(authHeader);
      const token = authHeader.split(" ")[1];
      let decoded;
      try{
        decoded = jwt.verify(token, SECRET_KEY);
      }
      catch(error){
        res.status(401).json({ error: "Token Expired. Please Login Again" });
        return;
      }
      const userId = decoded.userID || decoded.employeeId;
      let userRow;
      if(userId.startsWith("SA")){
        userRow = await SuperAdmin.findOne({where: {superAdminId: userId}, attributes: ['currentAccessToken']});
      }
      else{
        userRow = await Employee.findOne({where: {employeeId: userId}, attributes: ['currentAccessToken']});
      }
      if(userRow.currentAccessToken !== token){
        res.status(401).json({ error: "Token Error" });
      }
      const userRoleId = decoded.userRoleId;
      const isAllowed = await Permission.findOne({where: {pageAccessId: pageId, userRoleId: userRoleId}});
      // console.log(isAllowed, userRoleId, pageId);
      if(isAllowed){
        next();
      } else {
        res.status(403).json({ error: "Unauthorized" });
      }
     }
    catch(error){
      console.log(error);
      res.status(403).json({ error: error.message });
    }
  }
};

export const authenticateCustomerToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    let decoded;
    try{
      decoded = jwt.verify(token, SECRET_KEY);
    }
    catch(error){
      res.status(401).json({ error: "Token Expired. Please Login Again" });
      return;
    }
    const customerId = decoded.customerId;
    const userRow = await Customer.findByPk(customerId); // Corrected method name and argument
    if (!userRow) {
      res.status(401).json({ error: "Token Error" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};