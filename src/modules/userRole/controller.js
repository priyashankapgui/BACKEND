import sequelize from "../../../config/database.js";
import { createRole, getAllUserRoles, createPermissions, getRole } from "./service.js";

export const createUserRole = async (req, res) => {
    try {
        const { userRoleName,pageAccess } = req.body;

        // Make sure permissions is an array of numbers
        if (!Array.isArray(pageAccess) || !pageAccess.every(Number.isInteger)) {
            return res.status(400).json({ message: 'Permissions must be an array of numbers' });
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
    try {
        const userRoles = await getAllUserRoles();
        return res.status(200).json(userRoles);
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
        const permissions = await createPermissions(newUserRole.userRoleId, checkedPages, t);
        t.commit();
        return res.status(201).json({newUserRole, permissions});
    } catch (error) {
        t.rollback();
        return res.status(400).json({ error: error.message });
    }
};