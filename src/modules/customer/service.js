import Customer from "../customer/customer.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
import emailjs from "@emailjs/nodejs";


export const registerCustomer = async (customer) => {
    const {email, password, phone} = customer;

    // Check if the email already exists
    // const existingCustomer = await Customer.findOne({ where: { email: email } });
    // if (existingCustomer) {
    //     throw new Error("Email already exists");
    // }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    // Validate password
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
        throw new Error("Invalid password format");
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error("Invalid phone number");
    }


    try{
        const newCustomer = await Customer.create(customer);
        return newCustomer;
        }catch(error){
            throw new Error("Error creating customer: " + error.message);
        }
    };

// Function to handle login
export const handleLoginCustomer = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
  
    try {
      // Find the user in the database based on the provided email
      const user = await Customer.findOne({ where: { email: email } });
  
      if (!user) {
        return res.status(404).json({ message: "Invalid Credentials" });
      }
  
      const storedPassword = await user.password;
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      console.log(passwordMatch);
      if (passwordMatch) {
        const accessToken = jwt.sign(
          {
            employeeId: user.employeeId,
            role: user.role,
          },
          ACCESS_TOKEN,
          {
            expiresIn: "8h",
          }
        );
  
        //console.log(passwordMatch);
  
        // Send token and user information in response
        return res.status(200).json({
          message: "Login successful",
          token: accessToken,
          user: {
            customerId: user.customerId,
            customerName: user.firstName + " " + user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
          },
        });
      } else if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const forgotPasswordCustomer = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
      const user = await Customer.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
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
  
        const resetLink = `http://localhost:3000/login/forgotpw/resetpw?token=${passwordResetToken}`;
  
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
  
        // Send email using EmailJS with the  template
        emailjs.send("service_kqwt4xi", "template_hbmw31c", templateParams).then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            return res.status(200).json({
              message: "Password reset link sent to email",
              email: user.email,
              resetLink: resetLink,
            });
          },
          (error) => {
            console.log("FAILED...", error);
            return res.status(500).json({ message: "Failed to send email" });
          }
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  export const resetPasswordCustomer = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
  
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const decoded = jwt.verify(resetToken, ACCESS_TOKEN);
      const email = decoded.email;
  
      const user = await Customer.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: "Invalid Request" });
      }
  
      if (newPassword.length < 8 || newPassword.length > 20 || !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(newPassword)) {
        return res
          .status(400)
          .json({ message: "Invalid password format" });
      }
  
      if (newPassword === user.password) {
        return res
          .status(400)
          .json({ message: "New password cannot be the same as old password" });
      }
  
      
      user.password = newPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password reset successfull" });
    } catch (error) {
      console.error("Password reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };