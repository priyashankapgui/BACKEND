import jwt from "jsonwebtoken";
import { SECRET } from "../../config/config.js";
const { SECRET_KEY } = SECRET;
import Permission from "../modules/permission/permission.js";
import SuperAdmin from "../modules/superAdmin/superAdmin.js";
import Employee from "../modules/employee/employee.js";

export const authenticateToken = async(req, res, next) => {
  try{
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(!token){
      res.status(400).json({ error: "Token Missing" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
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
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
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
      console.log(isAllowed, userRoleId, pageId);
      if(isAllowed){
        next();
      } else {
        res.status(403).json({ error: "Unauthorized" });
      }
     }
    catch(error){
      console.log();
      res.status(403).json({ error: error.message });
    }
  }
};