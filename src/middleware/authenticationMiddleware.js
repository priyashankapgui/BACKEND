import jwt from "jsonwebtoken";
import { SECRET } from "../../config/config.js";
const { SECRET_KEY } = SECRET;
import Permission from "../modules/permission/permission.js";

export const authenticateToken = (req, res, next) => {
  try{
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  catch(error){
    res.status(403).json({ error: error.message });
  }
};

export function authenticateTokenWithPermission(pageId){
  return async function(req, res, next){
    try{
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
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