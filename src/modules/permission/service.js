import Permission from './permission.js';

const getAllPermissionsGroup = async (groupName) => {
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

export default getAllPermissionsGroup;