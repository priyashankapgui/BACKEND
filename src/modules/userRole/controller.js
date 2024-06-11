import sequelize from "../../../config/database.js";
import jwt from "jsonwebtoken";
import {
  createRole,
  getAllUserRoles,
  createPermissionsForUserRole,
  getRole,
  updateRole,
  updatePermissionsForUserRole,
  handleUserRoleDelete,
  getRolesByBranch,
} from "./service.js";
import { SECRET } from "../../../config/config.js";

const { SECRET_KEY } = SECRET;

export const createUserRole = async (req, res) => {
  try {
    const { userRoleName, pageAccess } = req.body;

    // Make sure permissions is an array of numbers
    if (!Array.isArray(pageAccess) || !pageAccess.every(Number.isInteger)) {
      return res
        .status(400)
        .json({ message: "Permissions must be an array of numbers" });
    }

    const newUserRole = await createRole(userRoleName, pageAccess);
    return res.status(201).json(newUserRole);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const { userRoleId } = req.params;
    const userRole = await getRole(userRoleId);
    return res.status(200).json(userRole);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserRoles = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const role = decoded.userRoleId;
    const branchName = decoded.branchName;
    if(role === 1 && !branchName){
      const userRoles = await getAllUserRoles();
      return res.status(200).json(userRoles);
    }
    else{
      const userRoles = await getRolesByBranch(branchName);
      return res.status(200).json(userRoles);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createUserRoleWithPermissions = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userRoleName, branch, checkedPages } = req.body;
    console.log(checkedPages);
    const newUserRole = await createRole(userRoleName, branch, t);
    const permissions = await createPermissionsForUserRole(
      newUserRole.userRoleId,
      checkedPages,
      t
    );
    t.commit();
    return res.status(201).json({ newUserRole, permissions });
  } catch (error) {
    t.rollback();
    return res.status(400).json({ error: error.message });
  }
};

export const updateUserRoleWithPermissions = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userRoleId } = req.params;
    const { userRoleName, branch, checkedPages } = req.body;
    const updatedUserRole = await updateRole(
      userRoleId,
      userRoleName,
      branch,
      t
    );
    const permissions = await updatePermissionsForUserRole(
      userRoleId,
      checkedPages,
      t
    );
    t.commit();
    return res.status(200).json({ updatedUserRole, permissions });
  } catch (error) {
    t.rollback();
    console.log(error);
    return res.status(400).json({ error: error.parent.sqlMessage });
  }
};

export const deleteUserRolWithPermissions = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userRoleId } = req.params;
        const deletedUserRole = await handleUserRoleDelete(userRoleId, t);
        t.commit();
        return res.status(200).json(deletedUserRole);
    }
    catch (error) {
        t.rollback();
        return res.status(400).json({ error: error.message });
    }
    };