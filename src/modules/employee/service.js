import Employee from "../employee/employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailjs from "@emailjs/nodejs";
import { SECRET } from "../../../config/config.js";
import branches from "../branch/branch.js";
import UserRole from "../userRole/userRole.js";
import sequelize from "../../../config/database.js";
import { raw } from "mysql2";

const salt = bcrypt.genSaltSync(10);
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;

// export const generateEmployeeId = async () => {
//   try {
//     const latestEmployee = await Employee.findOne({
//       order: [['employeeId', 'DESC']],
//       attributes: ['employeeId'],
//     });

//     let newEmployeeId;

//     if (latestEmployee && latestEmployee.employeeId) {
//       const numericPart = parseInt(latestEmployee.employeeId.substring(1), 10);
//       const incrementedNumericPart = numericPart + 1;
//       newEmployeeId = `E${incrementedNumericPart.toString().padStart(5, '0')}`;
//     } else {
//       newEmployeeId = 'E00001';
//     }

//     return newEmployeeId;
//   } catch (error) {
//     console.error('Error generating new employee ID:', error);
//     throw new Error('Could not generate new employee ID');
//   }
// }

export const getAllEmployees = async () => {
  try {
    const employees = await Employee.findAll( {
      raw: true,
      attributes: {
        include: ["userRole.userRoleName", "userRole.branch.branchName"],
        exclude: ["password"],
      },
      include: [
        {
          model: UserRole,
          include: [{ model: branches, attributes: [] }],
          attributes: [],
        },
      ],
    });
    return employees;
  } catch (error) {
    throw new Error("Error retrieving employees");
  }
};

export const getEmployeesByBranch = async (branchName) => {
  try {
    const employees = await Employee.findAll( {
      raw: true,
      attributes: {
        include: ["userRole.userRoleName", "userRole.branch.branchName"],
        exclude: ["password"],
        },
        include: [
          {
            model: UserRole,
            include: [{ 
              model: branches, 
              where: { branchName: branchName },
              attributes: [],
              required: true, 
            }],
            attributes: [],
            required: true,
        },
      ],
    });
    return employees;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId, {
      raw: true,
      attributes: {
        include: ["userRole.userRoleName", "userRole.branch.branchName"],
        exclude: ["password"],
      },
      include: [
        {
          model: UserRole,
          include: [{ model: branches, attributes: [] }],
          attributes: [],
        },
      ],
    });
    return employee;
  } catch (error) {
    throw new Error("Error fetching employee: " + error.message);
  }
};

export const createEmployee = async (employee) => {
  // const newEmployeeId = await generateEmployeeId();
  const {
    employeeId,
    employeeName,
    email,
    password,
    phone,
    address,
    userRoleName,
  } = employee;

  // Check if the employeeId already exists
  const existingEmployee = await Employee.findOne({
    where: { employeeId: employeeId },
  });
  if (existingEmployee) {
    throw new Error("Employee ID already exists");
  }

  const existingEmail = await Employee.findOne({ where: { email: email } });
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Validate userRoleId
  const userRoleID = await UserRole.findOne({
    where: { userRoleName: userRoleName },
  });
  const userRoleId = userRoleID ? userRoleID.dataValues.userRoleId : null;
  if (!userRoleID) {
    throw new Error("User role does not exist");
  }

  // Validate password
  if (password.length < 8 || password.length > 64) {
    throw new Error("Invalid password format");
  }

  try {
    const newEmployee = await Employee.create({
      employeeId,
      employeeName,
      email,
      password,
      userRoleId,
      phone,
      address,
    });
    return newEmployee;
  } catch (error) {
    throw new Error("Error creating employee: " + error.message);
  }
};

export const updateEmployeeById = async (
  employeeId,
  employeeData,
  role,
  branch
) => {
  //console.log(employeeData, employeeId, role, branch);
  const branchRow = await branches.findOne({
    where: { branchName: employeeData.branchName },
  });
  const userRoleId = await UserRole.findOne({
    where: { userRoleName: employeeData.userRoleName },
  });
  if (!userRoleId) {
    throw new Error("User role does not exist");
  }
  employeeData.userRoleId = userRoleId.userRoleId;
  const employee = await Employee.findByPk(employeeId);
  console.log(employee);
  if (!employee) {
    throw new Error("Employee not found");
  }
  try {
    if (role == 1 || branch === branchRow.branchName) {
      console.log(employeeData);
      const updatedEmployee = await employee.update(employeeData);
      return updatedEmployee;
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

export const updateEmployeePersonalInfo = async (employeeId, employeeData) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }
  try {
    const updatedEmployee = await employee.update(employeeData, {
      fields: ["employeeName", "email", "phone", "address", "password"],
    });
    return updatedEmployee;
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

export const deleteEmployeeById = async (employeeId, role, branch) => {
  const employee = await Employee.findByPk(employeeId, {
    attributes: {
      exclude: ["password"],
      },
    include: [
      {
        model: UserRole,
        include: [{ 
          model: branches, 
        }],
    },
  ],
  });
  if (!employee) {
    return null;
  }
  if (role == 1 || employee.userRole.branch.branchName === branch) {
    await employee.destroy();
    return employee;
  } else {
    throw new Error("Unauthorized");
  }
};

export const handleLogin = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Find the user in the database based on the provided empID
    const user = await Employee.findByPk(employeeId, {
      raw: true,
      attributes: {
        include: ["userRole.userRoleName", "userRole.branch.branchName"],
      },
      include: [
        {
          model: UserRole,
          include: [{ model: branches, attributes: [] }],
          attributes: [],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
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
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
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
      return res.status(404).json({ message: "Employee ID not found" });
    } else {
      const passwordResetToken = jwt.sign(
        {
          userId: user.employeeId,
          email: user.email,
        },
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

export const handleEmployeeResetPassword = async (userId, newPassword) => {
  const user = await Employee.findByPk(userId);
  if (!user) {
    throw new TypeError("Employee ID not found");
  }
  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    throw new TypeError("New password cannot be the same as the old password");
  }
  user.password = newPassword;
  await user.save();
  return;
};
