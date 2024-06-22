import { SECRET } from "../../../config/config.js";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN = SECRET.SECRET_KEY;
import {
    getAllSuperAdmins,
    handleSuperAdminLogin,
    sendSuperAdminPasswordResetEmail,
    handleSuperAdminResetPassword,
    updateSuperAdminById,
}from "../superAdmin/service.js";


export const getSuperAdmins = async (req, res) => {
    try {
        const superAdmins = await getAllSuperAdmins();
        res.status(200).json(superAdmins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const superAdminLogin = async (req, res) => {

    const { userID, password } = req.body;
    try {
        const data = await handleSuperAdminLogin(userID, password);
        const token = data.token;
        const user = data.superAdmin;
        res.status(200).json({ 
            message:"Login successful",
            token: token,
            user: {
                userID: userID,
                role: data.userRoleName,
                userName: user.superAdminName,
                email: user.email,
                phone: user.phone,
                address: user.address,
            }
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const superAdminForgotPassword = async (req, res) => {
    const { userID } = req.body;
    try {
        const data = await sendSuperAdminPasswordResetEmail(userID, "template_resetpw509");
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const superAdminResetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword} = req.body;
    try {
        const data = await handleSuperAdminResetPassword(resetToken, newPassword, confirmPassword);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSuperAdmin = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    const role = decoded.role;
    const userID = decoded.userID;
    const updatedSuperAdminData = req.body;
    if (role != "superAdmin" && userID != superAdminID) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const updatedSuperAdmin = await updateSuperAdminById(
            superAdminID,
            updatedSuperAdminData,
        );
        if (!updatedSuperAdmin) {
            res.status(404).json({ error: "SuperAdmin not found" });
            return;
        }
        res.status(200).json({
            message: "SuperAdmin updated successfully",
            superAdmin: updatedSuperAdmin,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {getSuperAdmins, superAdminLogin, superAdminForgotPassword, superAdminResetPassword, updateSuperAdmin};