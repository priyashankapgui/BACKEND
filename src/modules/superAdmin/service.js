import SuperAdmin from "./superAdmin.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
import emailjs from "@emailjs/nodejs";

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
    const isPasswordValid = bcrypt.compareSync(password, superAdmin.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      {
        userID: superAdmin.superAdminId,
        role: "superAdmin",
      },
      ACCESS_TOKEN,
      {
        expiresIn: "8h",
      }
    );

    return { token: token, superAdmin: superAdmin };
  } catch (error) {
    throw new Error("Error logging in: " + error.message);
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

export const handleSuperAdminResetPassword = async (resetToken, newPassword, confirmPassword) => {
      try {
        if (!resetToken || !newPassword || !confirmPassword) {
           throw new Error("Missing required fields");
        }
        const decoded = jwt.verify(resetToken, ACCESS_TOKEN);
        const email = decoded.email;
        const user = await SuperAdmin.findOne({ where: { email: email } });
        if (!user) {
          throw new Error("User not found");
        }
        if (newPassword === user.password) {
          throw new Error("New password cannot be the same as old password");
        }
        user.password = newPassword;
        await user.save();
        return "Password reset successful";
      } catch (error) {
        console.error("Password reset error:", error);
        throw new Error(error.message);
      }
}

export const updateSuperAdminById = async (superAdminID, updatedSuperAdminData) => {
  try {
    const superAdmin = await SuperAdmin.findByPk(superAdminID);
    if (!superAdmin) {
      throw new Error("SuperAdmin not found");
    }
    const updatedSuperAdmin = await superAdmin.update(updatedSuperAdminData);
    return updatedSuperAdmin;
  } catch (error) {
    throw new Error("Error updating superAdmin: " + error.message);
  }
};