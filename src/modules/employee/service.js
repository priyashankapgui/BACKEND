import Employee from "../employee/employee.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
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
  const { employeeId,role,email, password ,phone} = employee;

  // Check if the employeeId already exists
  const existingEmployee = await Employee.findOne({ where: { employeeId: employeeId } });
  if (existingEmployee ) {
    throw new Error("Employee ID already exists");
  }
  else if(employeeId.length != 4){
    throw new Error("Employee ID must be a 4-digit number");
  }

  const existingEmail = await Employee.findOne({ where: { email: email } });
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Validate employee role
  const roleRegex = /^(cashier|admin|superadmin)$/;
  if (!roleRegex.test(role)) {
    throw new Error("Invalid role");
  }
 

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


  try {
    const newEmployee = await Employee.create(employee);
    return newEmployee;
  } catch (error) {
    throw new Error("Error creating employee: " + error.message);
  }
};

export const updateEmployeeById = async (employeeId, employeeData, role, branch) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }
  if (
    role === "superadmin" ||
    (role === "admin" &&
      employee.branchName === branch &&
      employee.role !== "admin" &&
      employee.role !== "superadmin")
  ) {
    const updatedEmployee = await employee.update(employeeData);
    return updatedEmployee;
  } else {
    throw new Error("Unauthorized");
  }
};

export const deleteEmployeeById = async (employeeId, role, branch) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    return null;
  }
  if (
    role === "superadmin" ||
    (role === "admin" &&
      employee.branchName === branch &&
      employee.role !== "admin" &&
      employee.role !== "superadmin")
  ) {
    await employee.destroy();
    return employee;
  } else {
    throw new Error("Unauthorized");
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
          branchName: user.branchName,
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
          branchName: user.branchName,
          employeeName: user.employeeName,
          email: user.email,
          role: user.role,
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

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const verify = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User Verified",
});
}


//function to verify admin
export const verifyAdmin = async(req,res)=> {
  const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];



  try {

    const decoded = jwt.verify(token,ACCESS_TOKEN);
    console.log(decoded);
    const {employeeId,role} = decoded;

    // Check if the employeeid and role matches the one associated with the user's account
    const user = await Employee.findOne({ employeeId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    else if (role != 'admin' && role != 'superadmin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    else{
      return res.status(200).json({ message: 'User Verified' });
    }
    
  } catch (error) {
  return res.status(500).json({ error: error.message });
  }
}

// Function to verify super admin
export const verifySuperAdmin = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN);

    const { employeeId, role } = decoded;

    // Check if the employeeid and role matches the one associated with the user's account
    const user = await Employee.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (role != "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      return res.status(200).json({ message: "User Verified" });
    }
  } catch (error) {
   
    return res.status(500).json({ error: error.message });
  }
}

