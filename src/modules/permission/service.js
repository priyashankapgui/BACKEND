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