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

export const getRole = async (userRoleId) => {
    try{
        const userRole = await sequelize.query("select distinct userRoleId, userRoleName, ur.branchId, branchName from userrole as ur left join branches as b on ur.branchId=b.branchId where userRoleId = :userRoleId;", {
            replacements: { userRoleId: userRoleId }
        });
        return userRole[0][0];
    }
    catch(error){
        throw new Error(error.message);
    }
}

export const getRolesByBranch = async (branchName) => {
    try{
        const userRoles = await sequelize.query("select userRoleId, userRoleName, ur.branchId, branchName from userrole as ur left join branches as b on ur.branchId=b.branchId where branchName = :branchName;", {
            replacements: { branchName: branchName }
        });
        return userRoles[0];
    }
    catch(error){
        throw new Error(error.message);
    }
}

export const updateRole = async (userRoleId, userRoleName, branch, t) => {
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
    const updatedUserRole = await UserRole.update(userRole, {where: {userRoleId: userRoleId}, transaction: t});
    return updatedUserRole;
};

export const getAllUserRoles = async () => {
    const userRoles = await sequelize.query("select userRoleId, userRoleName, ur.branchId, branchName from userrole as ur left join branches as b on ur.branchId=b.branchId;");
    return userRoles[0];
};

export const createPermissionsForUserRole = async (userRoleId, checkedPages, t) => {
    if (!Array.isArray(checkedPages)) {
        throw new Error("Permissions must be an array of strings");
    }
    const permissions = checkedPages.map(pageId => {
        return { userRoleId: userRoleId, pageAccessId: pageId };
    });
    const newPermissions = await Permission.bulkCreate(permissions, {transaction: t});
    return newPermissions;
};

export const updatePermissionsForUserRole = async (userRoleId, checkedPages, t) => {
    if (!Array.isArray(checkedPages)) {
        throw new Error("Permissions must be an array of strings");
    }
    await Permission.destroy({where: {userRoleId: userRoleId}, transaction: t});
    const permissions = checkedPages.map(pageId => {
        return { userRoleId: userRoleId, pageAccessId: pageId };
    });
    const newPermissions = await Permission.bulkCreate(permissions, {transaction: t});
    return newPermissions;
};

export const handleUserRoleDelete = async (userRoleId, t) => {
    try{
        const deletedUser = await UserRole.destroy({where: {userRoleId: userRoleId}, transaction: t});
        const deletedPermissions = await Permission.destroy({where: {userRoleId: userRoleId}, transaction: t});
        return {deletedUser, deletedPermissions};
    }
    catch(error){
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            throw new Error("There are Users associated with this User Role. Cannot delete");
        }
        else{
            throw new Error(error.message);
        }
    }
};