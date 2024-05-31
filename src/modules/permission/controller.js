import getAllPermissionsGroup from './service.js';
import jwt from 'jsonwebtoken';
import { SECRET } from '../../../config/config.js';
const ACCESS_TOKEN = SECRET.SECRET_KEY;

export const getPermissionsGroup = async (req, res) => {
    const { groupName } = req.body;
    try {
        const permissionsGroup = await getAllPermissionsGroup(groupName);
        res.status(200).json(permissionsGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verifyPermissions = async (req, res) => {
    const data = req.body;
    const token = data.token;
    const groupName = data.groupName;
    try {
        console.log(req.body);
        const decoded = jwt.verify(token, ACCESS_TOKEN);
        const userRoleId = decoded.userRoleId;
        const permissionsGroup = await getAllPermissionsGroup(groupName);
        if (permissionsGroup.includes(userRoleId)) {
            res.status(200).json({ message: "Permission Granted" });
        } else {
            res.status(403).json({ message: "Permission Denied" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserRolePermissions = async (req, res) => {
    const { userRoleId } = req.body;
    try {
        const permissionsGroup = await getAllPermissionsGroup(userRoleId);
        res.status(200).json(permissionsGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}