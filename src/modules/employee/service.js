import Employee from "../employee/employee.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;
import emailjs from "@emailjs/nodejs";
import branches from "../branch/branch.js";
import UserRole from "../userRole/userRole.js";

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
  const { employeeId,email, password ,phone, branchName, userRoleName} = employee;

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

  // Validate branchId
  const branchId =await branches.findOne({where: {branchName: branchName}});
  if (!branchId) {
    throw new Error("Branch does not exist");
  }
  // Validate userRoleId
  const userRoleID= await UserRole.findOne({where: {userRoleName: userRoleName}});
  if (!userRoleID) {
    throw new Error("User role does not exist");
  }
 
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password
  if (password.length < 8 || password.length > 64) {
    throw new Error("Invalid password format");
  } 

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number");
  }

  try {
    employee={branchId: branchId.branchId, userRoleId: userRoleID.userRoleId, ...employee}
    const newEmployee = await Employee.create(employee);
    return newEmployee;
  } catch (error) {
    throw new Error("Error creating employee: " + error.message);
  }
};

export const updateEmployeeById = async (employeeId, employeeData, role, branch) => {
  console.log(employeeData, employeeId);
  const branchid = await branches.findOne({where: {branchName: employeeData.branchName}});
  const employee = await Employee.findByPk(parseInt(employeeId));
  console.log(role);
  if (!employee) {
    throw new Error("Employee not found");
  }
  try{
  if (
    // role === "superadmin" ||
    // (role === "admin" &&
    //   employee.branchName === branch &&
    //   employee.role !== "admin" &&
    //   employee.role !== "superadmin")

    role == 1 || branch === branchid.branchName
  ) {
   
    console.log(employeeData);
    const updatedEmployee = await employee.update(employeeData);
    return updatedEmployee;
  }
    else{
      throw new Error("Unauthorized");
    }
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

export const deleteEmployeeById = async (employeeId, role, branch) => {
  const employee = await Employee.findByPk(employeeId);
  console.log(employee);
  if (!employee) {
    return null;
  }
  if (role == 1 || employee.branchName === branch) {
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
          role: user.userRoleName,
          userRoleId: user.userRoleId,
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
          userID: user.employeeId,
          branchName: user.branchName,
          userName: user.employeeName,
          email: user.email,
          role: user.userRoleName,
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
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ message: "employee ID is required" });
  }
  try {
    const user = await Employee.findOne({ where: { employeeId: employeeId } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      const passwordResetToken = jwt.sign(
        {
          userId: user.employeeId,
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
        receiver_name: user.employeeName,
        receiver_email: user.email,
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

export const handleEmployeeResetPassword = async (userId, newPassword) => {
  const user = await Employee.findByPk({ where: { employeeId: userId } });
  if (!user) {
    throw new TypeError("Employee ID not found");
  }
  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    throw new TypeError("New password cannot be the same as the old password");
  }
  await user.save();
  return;
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

