import sequelize from '../../../config/database.js';
import Permission from './permission.js';

export const getAllPermissionsGroup = async (groupName) => {
    try {
        let permissionsGroup = await Permission.findAll({
            where: {
                pageAccessId: groupName
            }
        });
        permissionsGroup = permissionsGroup.map((permission) => permission.userRoleId);
        return permissionsGroup;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getPermissions = async (userRoleId) => {
    try {
        const permissions = await Permission.findAll({
            where: {
                userRoleId
            }
        });
        return permissions;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getPermissionsWithPageAccess = async (userRoleId) => {
    try {
        const permissions = await sequelize.query("select * from permission join pageaccess on permission.pageAccessId = pageaccess.pageId where userRoleId = :userRoleId", {
            replacements: { userRoleId },
            type: sequelize.QueryTypes.SELECT
        });
        return permissions;
    } catch (error) {
        throw new Error(error.message);
    }
}