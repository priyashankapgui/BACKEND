import SuperAdmin from "./superAdmin.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { AUTH, SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
import emailjs from "@emailjs/nodejs";
import UserRole from "../userRole/userRole.js";
import { imageUploadwithCompression } from "../../blobService/utils.js";
import sequelize from "../../../config/database.js";

export const getAllSuperAdmins = async () => {
  try {
    const superAdmins = await SuperAdmin.findAll();
    return superAdmins;
  } catch (error) {
    throw new Error("Error retrieving superAdmins");
  }
};

export const handleSuperAdminLogin = async (superAdminId, password) => {
  try {
    const superAdmin = await SuperAdmin.findByPk(superAdminId);
    if (!superAdmin) {
      throw new Error("SuperAdmin not found");
    }

    if (
      superAdmin.failedLoginAttempts >= AUTH.MAX_FAILED_ATTEMPTS &&
      superAdmin.loginAttemptTime > new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)
    ) {
      const remainingTime = Math.round(
        (superAdmin.loginAttemptTime - new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)) / (60 * 1000)
      );
      throw new Error(`This Account is locked. Please try again in ${remainingTime} minutes`);
    }
    
    superAdmin.loginAttemptTime = new Date();

    const isPasswordValid = bcrypt.compareSync(password, superAdmin.password);
    if (!isPasswordValid) {
      superAdmin.failedLoginAttempts += 1;
      await superAdmin.save();
      throw new Error("Invalid credentials");
    }
    superAdmin.failedLoginAttempts = 0;
    const userRole = await UserRole.findByPk(superAdmin.userRoleId);
    const userRoleName = userRole.userRoleName;
    const token = jwt.sign(
      {
        userID: superAdmin.superAdminId,
        userRoleId: superAdmin.userRoleId,
      },
      ACCESS_TOKEN,
      {
        expiresIn: "8h",
      }
    );
    superAdmin.currentAccessToken = token;
    await superAdmin.save();
    return { token: token, superAdmin: superAdmin, userRoleName: userRoleName };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const handleSuperAdminForgotPassword = async (userID) => {
  try {
    const user = await SuperAdmin.findByPk(userID);
    if (!user) {
      throw new Error("SuperAdmin not found");
    } else {
      const passwordResetToken = jwt.sign(
        {
          userId: user.superAdminId,
          email: user.email,
        },
        ACCESS_TOKEN,
        {
          expiresIn: "5m",
        }
      );
      const resetLink = `http://localhost:3000/login/resetpw?token=${passwordResetToken}`;
      emailjs.init({
        publicKey: "U4RoOjKB87mzLhhqW",
        privateKey: process.env.EMAILJS_API_KEY,
        blockHeadless: true,
        limitRate: {
          id: "app",
          throttle: 10000,
        },
      });
      const templateParams = {
        resetLink: resetLink,
        receiver_name: user.superAdminName,
        receiver_email: user.email,
      };
      let data = {};
      // Send email using EmailJS with the  template
      try {
        const response = await emailjs.send("service_kqwt4xi", "template_hbmw31c", templateParams);
        console.log("SUCCESS!", response.status, response.text);
        data = {
          message: "Password reset link sent to email",
          email: user.email,
          resetLink: resetLink,
        };
      } catch (error) {
        console.log("FAILED...", error);
        data = { message: "Failed to send email" };
      }
      return data;
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    throw new Error(error.message);
  }
};

export const handleSuperAdminResetPassword = async (userId, newPassword) => {
  const user = await SuperAdmin.findOne({ where: { superAdminId: userId } });
  if (!user) {
    throw new TypeError("Super Admin ID not found");
  }
  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    throw new TypeError("New password cannot be the same as the old password");
  }
  user.password = newPassword;
  await user.save();
  return;
};

export const updateSuperAdminById = async (req, superAdminID, updatedSuperAdminData) => {
  const t = await sequelize.transaction();
  try {
    const superAdmin = await SuperAdmin.findByPk(superAdminID);
    if (!superAdmin) {
      throw new Error("SuperAdmin not found");
    }
    const updatedSuperAdmin = await superAdmin.update(updatedSuperAdminData, {
      transaction: t,
    });
    if (req.file) {
      await imageUploadwithCompression(req.file, "cms-data", superAdminID);
    }
    await t.commit();
    return updatedSuperAdmin;
  } catch (error) {
    await t.rollback();
    throw new Error("Error updating superAdmin: " + error.message);
  }
};
