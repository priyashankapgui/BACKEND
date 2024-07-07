import Customer from "../customer/customer.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { AUTH, SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
import emailjs from "@emailjs/nodejs";
import ResponseError from "../../ResponseError.js";

export const registerCustomer = async (customer) => {
  console.log("Registering customer", customer)
  const { email, password} = customer;
  //Check if the email already exists
  const existingCustomer = await Customer.findOne({ where: { email: email } });
  if (existingCustomer) {
    throw new Error("Email already exists");
  }
  if (password.length < 8 || password.length > 64) {
    throw new Error("Invalid password format");
  }
  try {
    const newCustomer = await Customer.create(customer);
    return newCustomer;
  } catch (error) {
    throw new Error("Error Creating Customer: " + error.errors[0]?.message ? error.errors[0].message : error.message);
  }
};

export const getCustomerById = async (customerId) => {
  try {
    const customer = await Customer.findByPk(customerId);
    return customer;
  } catch (error) {
    throw new Error("Error fetching customer: " + error.message);
  }
};

export const updateCustomerService = async (customerId, updatedCustomerData) => {
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const customerData = await customer.update(updatedCustomerData, {
      attributes: {exclude: ["customerId", "password"]},
    });
    console.log(customerData);
    return customerData;
  } catch (error) {
    throw new Error("Error Updating Customer: " + error.errors[0]?.message ? error.errors[0].message : error.message);
  }
};

export const updatePasswordService = async (customerId, oldPassword, newPassword) => {
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const storedPassword = await customer.password;
    const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);
    if (!passwordMatch) {
      throw new Error("Invalid old password");
    }
    if (oldPassword === newPassword) {
      throw new Error("New password cannot be the same as old password");
    }
    customer.password = newPassword;
    await customer.save();
    return { message: "Password updated successfully" };
  } catch (error) {
    throw new Error("Error updating password: " + error.message);
  }
};

export const loginCustomerService = async (email, password, returnHostLink) => {
  const tempUser = await Customer.findOne({ where: { email: email } });
  //console.log(tempUser.email);
  if (!tempUser) {
    throw new ResponseError(404,"Email not found");
  }
  if(tempUser.failedLoginAttempts >= AUTH.MAX_FAILED_ATTEMPTS && tempUser.loginAttemptTime > new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)){
    const remainingTime = Math.round((tempUser.loginAttemptTime - new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)) / (60*1000));
    // Send password reset email if account is locked
    throw new Error( `This Account has been locked, please try again in ${remainingTime} minutes`);
  }
  tempUser.loginAttemptTime = new Date();
  const storedPassword = await tempUser.password;
  const passwordMatch = await bcrypt.compare(password, storedPassword);
  if (passwordMatch) {
    const accessToken = jwt.sign(
      {
        customerId: tempUser.customerId,
        email: tempUser.email,
      },
      ACCESS_TOKEN,
      {
        expiresIn: "8h",
      }
    );
    // Reset failed login attempts
    tempUser.failedLoginAttempts = 0;
    await tempUser.save();
    // Return token and user information
    return {
      message: "Login successful",
      token: accessToken,
      user: {
        customerId: tempUser.customerId,
        firstName:tempUser.firstName,
        lastName: tempUser.lastName,
        email: tempUser.email,
        phone: tempUser.phone,
        address: tempUser.address,
        cartId: tempUser.cartId,
      },
    };
  } else {
    tempUser.failedLoginAttempts = (tempUser.failedLoginAttempts || 0) + 1;
    if(tempUser.failedLoginAttempts >= AUTH.MAX_FAILED_ATTEMPTS) {
      await resetPasswordEmail(tempUser.email, "template_securityw509", returnHostLink); 
    }
    await tempUser.save();
    throw new ResponseError(401,"Invalid Credentials");
    
  }
};

export const resetPasswordEmail = async (email, emaliTemplate, returnHostLink) => {
  if (!email) {
      throw new Error("Email is required");
  }
  try {
    const user = await Customer.findOne({ where: { email: email } });
    if (!user) {
        throw new Error("Email not found");
    }
    else {
      const passwordResetToken = jwt.sign(
        {
          customerId: user.customerId,
          email: user.email,
        },
        ACCESS_TOKEN,
        {
          expiresIn: "15m",
        }
      );
      const resetLink = `http://${returnHostLink}/login/forgotpw/resetpw?token=${passwordResetToken}`;
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
        receiver_name: user.firstName,
        receiver_email: user.email,
      };

      // Send email using EmailJS with the  template
      emailjs.send("service_kqwt4xi", emaliTemplate, templateParams).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          return ({
            message: "Password reset link sent to email",
            email: user.email,
            resetLink: resetLink,
          });
        },
        (error) => {
          console.log("FAILED...", error);
            throw new Error("Failed to send email");
        }
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
      throw new Error("Internal server error");
    }
};

export const resetPasswordCustomer = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    let decoded;
    try{
      decoded = jwt.verify(resetToken, ACCESS_TOKEN);
    }
    catch(error){
      return res.status(401).json({ message: "This link is invalid or has expired" });
    }
    const email = decoded.email;
    const user = await Customer.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid Request" });
    }
    if (newPassword === user.password) {
      return res.status(400).json({ message: "New password cannot be the same as old password" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
