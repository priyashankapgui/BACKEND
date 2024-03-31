import Employee from "../employee/employee.js";

import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

import jwt from "jsonwebtoken";

import { ACCESS } from "../../../config/config.js";
const { ACCESS_TOKEN } = ACCESS;

import emailjs from "@emailjs/nodejs";

export const getAllEmployees = async () => {
  try {
    const employees = await Employee.findAll();
    return employees;
  } catch (error) {
    throw new Error("Error retrieving employees");
  }
};

export const getEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    return employee;
  } catch (error) {
    throw new Error("Error fetching employee: " + error.message);
  }
};

export const createEmployee = async (employee) => {
  try {
    const newEmployee = await Employee.create(employee);
    return newEmployee;
  } catch (error) {
    throw new Error("Error creating employee: " + error.message);
  }
};

export const updateEmployeeById = async (employeeId, employeeData) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return null;
    }
    const updatedEmployee = await employee.update(employeeData);
    return updatedEmployee;
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

export const deleteEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return null;
    }
    await employee.destroy();
    return employee;
  } catch (error) {
    throw new Error("Error deleting employee: " + error.message);
  }
};

// Function to handle login
export const handleLogin = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find the user in the database based on the provided empID
    const user = await Employee.findOne({ where: { employeeId: employeeId } });

    if (!user) {
      // User not found
      return res.status(404).json({ message: "User not found" });
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
          employeeId: user.employeeId,
          employeeName: user.employeeName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      });
    } else if (!passwordMatch) {
      // Passwords match, login successful
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await Employee.findOne({ where: { email: email } });
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

      const resetLink = `http://localhost:3000/login/resetpw?token=${passwordResetToken}`;

      emailjs.init({
        publicKey: "U4RoOjKB87mzLhhqW",
        privateKey: process.env.EMAILJS_API_KEY,
        // Do not allow headless browsers
        blockHeadless: true,

        limitRate: {
          // Set the limit rate for the application
          id: "app",
          // Allow 1 request per 10s
          throttle: 10000,
        },
      });

      // Provide template params if needed (optional)
      const templateParams = {
        resetLink: resetLink,
      };

      // Send email using EmailJS with the specified template
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

export const passwordReset = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const decoded = jwt.verify(resetToken, ACCESS_TOKEN);
    const email = decoded.email;

    const user = await Employee.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid Request" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (newPassword === user.password) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as old password" });
    }

    //const hashedPassword = bcrypt.hashSync(newPassword, salt);
    //user.password = hashedPassword;
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyAdmin = async(req,res)=> {
  const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];


// Verify the token
  try {
    const decoded = jwt.verify(token,ACCESS_TOKEN);

    const {employeeId,role} = decoded;

    // Check if the employeeid and role matches the one associated with the user's account
    const user = await Employee.findOne({ employeeId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    else if (role != 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    else{
      return res.status(200).json({ message: 'User Verified' });
    }
    
  } catch (error) {
    // Handle token verification errors
  return res.status(500).json({ error: error.message });
  }
}

