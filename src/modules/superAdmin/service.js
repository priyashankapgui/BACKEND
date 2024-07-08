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
import ResponseError from "../../ResponseError.js";

export const getAllSuperAdmins = async () => {
  try {
    const superAdmins = await SuperAdmin.findAll();
    return superAdmins;
  } catch (error) {
    throw new Error("Error retrieving superAdmins");
  }
};

export const handleSuperAdminLogin = async (superAdminId, password, returnHostLink) => {
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
      if(superAdmin.failedLoginAttempts >= AUTH.MAX_FAILED_ATTEMPTS){
        sendSuperAdminPasswordResetEmail(superAdmin.superAdminId, "template_securityw509", returnHostLink)
      }
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

export const sendSuperAdminPasswordResetEmail = async (userID, emailTemplate, returnHostLink) => {
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
      const resetLink = `${returnHostLink}/login/resetpw?token=${passwordResetToken}`;
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
        const response = await emailjs.send("service_kqwt4xi", emailTemplate, templateParams);
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
  if (newPassword.length < 8 || newPassword.length > 64) {
    throw new Error("Invalid password format");
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

export const updateSuperAdminPassword = async ( superAdminID, superAdminPasswordData) => {
  console.log(superAdminPasswordData);
  const currentPassword = superAdminPasswordData.currentPassword;
  const newPassword = superAdminPasswordData.newPassword;
  const superAdmin = await SuperAdmin.findByPk(superAdminID);
  if (!superAdmin) {
    throw new ResponseError(400,"SuperAdmin not found");
  }
  if (newPassword.length < 8 || newPassword.length > 64) {
    throw new Error("Invalid password format");
  }
  const storedPassword = await superAdmin.password;
  const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);
  if (!passwordMatch) {
    throw new ResponseError(401,"Invalid old password");
  }
  if (currentPassword === newPassword) {
    throw new ResponseError(400,"New password cannot be the same as old password");
  }
  superAdmin.password = newPassword;
  await superAdmin.save();
  return newPassword;
}
