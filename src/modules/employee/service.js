import Employee from "../employee/employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailjs from "@emailjs/nodejs";
import { SECRET } from "../../../config/config.js";
import branches from "../branch/branch.js";
import UserRole from "../userRole/userRole.js";

const salt = bcrypt.genSaltSync(10);
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;

export const generateEmployeeId = async () => {
  try {
    const latestEmployee = await Employee.findOne({
      order: [['employeeId', 'DESC']],
      attributes: ['employeeId'],
    });

    let newEmployeeId;

    if (latestEmployee && latestEmployee.employeeId) {
      const numericPart = parseInt(latestEmployee.employeeId.substring(1), 10);
      const incrementedNumericPart = numericPart + 1;
      newEmployeeId = `E${incrementedNumericPart.toString().padStart(5, '0')}`;
    } else {
      newEmployeeId = 'E00001';
    }

    return newEmployeeId;
  } catch (error) {
    console.error('Error generating new employee ID:', error);
    throw new Error('Could not generate new employee ID');
  }
}

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
  const newEmployeeId = await generateEmployeeId();
  const { employeeName, email, password, role, branchName, phone, address, userRoleName } = employee;

  // Check if the employeeId already exists
  const existingEmployee = await Employee.findOne({ where: { employeeId: newEmployeeId } });
  if (existingEmployee) {
    throw new Error("Employee ID already exists");
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
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
    throw new Error("Invalid password format");
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number");
  }

  try {
    const newEmployee = await Employee.create({
      employeeId: newEmployeeId,
      employeeName,
      email,
      password,
      userRoleID: userRoleID.userRoleId,
      branchId: branchId.branchId,
      phone,
      address
    });
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

export const handleLogin = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find the user in the database based on the provided empID
    const user = await Employee.findOne({ where: { employeeId: employeeId } });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const storedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (passwordMatch) {
      const accessToken = jwt.sign(
        {
          employeeId: user.employeeId,
          role: user.userRoleName,
          userRoleId: user.userRoleId,
          branchName: user.branchName,
        },
        ACCESS_TOKEN,
        { expiresIn: "8h" }
      );

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
    } else {
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
    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      const passwordResetToken = jwt.sign(
        { email: user.email },
        ACCESS_TOKEN,
        { expiresIn: "5m" }
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

      const templateParams = { resetLink };

      emailjs.send("service_kqwt4xi", "template_hbmw31c", templateParams).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          return res.status(200).json({
            message: "Password reset link sent to email",
            email: user.email,
            resetLink,
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

    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid Request" });
    }

    if (newPassword.length < 8 || newPassword.length > 20 ||
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(newPassword)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    if (newPassword === user.password) {
      return res.status(400).json({ message: "New password cannot be the same as old password" });
    }

    user.password = bcrypt.hashSync(newPassword, salt);
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

export const verifyAdmin = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({
      status: "success",
      message: "User Verified",
    });
  });
}


// Add this function definition in service.js
export const verifySuperAdmin = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({
      status: "success",
      message: "User Verified",
    });
  });
};
