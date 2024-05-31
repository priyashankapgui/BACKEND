import sequelize from "../../../config/database.js";
import branches from "../branch/branch.js";
import Permission from "../permission/permission.js";
import UserRole from "./userRole.js";

export const createRole = async (userRoleName, branch, t) => {
    if (!userRoleName) {
        throw new Error("User role name is required");
    }
    let userRole = {}
    if (!branch) {
        userRole = { userRoleName: userRoleName };
    }
    else{
        const branchId = await branches.findOne({where: {branchName: branch}});
        userRole = { userRoleName: userRoleName, branchId: branchId.branchId };
    }
    const newUserRole = await UserRole.create(userRole, {transaction: t});
    return newUserRole;
};

export const getAllUserRoles = async () => {
    const userRoles = await sequelize.query("select userRoleId, userRoleName, ur.branchId, branchName from userrole as ur left join branches as b on ur.branchId=b.branchId;");
    return userRoles[0];
};

export const createPermissions = async (userRoleId, checkedPages, t) => {
    if (!Array.isArray(checkedPages)) {
        throw new Error("Permissions must be an array of strings");
    }
    const permissions = checkedPages.map(pageId => {
        return { userRoleId: userRoleId, pageAccessId: pageId };
    });
    const newPermissions = await Permission.bulkCreate(permissions, {transaction: t});
    return newPermissions;
};