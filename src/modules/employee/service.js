import Employee from "../employee/employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailjs from "@emailjs/nodejs";
import { AUTH, SECRET } from "../../../config/config.js";
import branches from "../branch/branch.js";
import UserRole from "../userRole/userRole.js";
import sequelize from "../../../config/database.js";
import { raw } from "mysql2";
import { imageUploadMultiple, imageUploadwithCompression } from "../../blobService/utils.js";
import ResponseError from "../../ResponseError.js";

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

export const createEmployee = async (req) => {
  // const newEmployeeId = await generateEmployeeId();
  console.log(req.body.employee);
  const {
    employeeId,
    employeeName,
    email,
    password,
    phone,
    address,
    userRoleName,
  } = JSON.parse(req.body.employee);
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

  

  const t = await sequelize.transaction();
  try {
    const newEmployee = await Employee.create({
      employeeId,
      employeeName,
      email: email !== "" ? email : undefined,
      password,
      userRoleId,
      phone: phone !== "" ? phone : undefined,
      address: address !== "" ? address : undefined,
    }, { transaction: t });
    if (req.file){
      await imageUploadwithCompression(req.file, "cms-data", employeeId);
    }
    await t.commit();
    return newEmployee;
  } catch (error) {
    await t.rollback();
    throw new Error("Error creating employee: " + error.message);
  }
};

export const updateEmployeeById = async (
  req,
  employeeId,
  employeeData,
  role,
  branch
) => {
  //console.log(employeeData, employeeId, role, branch);
  const branchRow = await branches.findOne({
    where: { branchName: employeeData.branchName },
  });
  const userRole = await UserRole.findOne({
    where: { userRoleName: employeeData.userRoleName },
  });
  if (!userRole) {
    throw new Error("User role does not exist");
  }
  if (userRole.userRoleId === 1){
    throw new Error("Cannot assign super admin role to employee");
  }
  employeeData.userRoleId = userRole.userRoleId;
  const employee = await Employee.findByPk(employeeId);
  console.log(employee);
  if (!employee) {
    throw new Error("Employee not found");
  }
  try {
    if (role == 1 || branch === branchRow.branchName) {
      console.log(employeeData);
      const t = await sequelize.transaction();
      const updatedEmployee = await employee.update(employeeData, {transaction: t});
      if (req.file) {
        await imageUploadwithCompression(req.file, "cms-data", employeeId);
      }
      await t.commit();
      return updatedEmployee;
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    await t.rollback();
    throw new Error("Error updating employee: " + error.message);
  }
};

export const updateEmployeePersonalInfo = async (req, employeeId, employeeData) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }
  const t = await sequelize.transaction();
  try {
    const updatedEmployee = await employee.update(employeeData, {
      fields: ["employeeName", "email", "phone", "address", "password"],
      transaction: t,
    });
    if(req.file){
      await imageUploadwithCompression(req.file, "cms-data", employeeId);
    }
    await t.commit();
    return updatedEmployee;
  } catch (error) {
    await t.rollback();
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

export const handleLogin = async (employeeId, password) => {
  const tempUser = await Employee.findByPk(employeeId);
  if (!tempUser) {
    throw new ResponseError(404, "Employee not found")
  }
  if (tempUser.failedLoginAttempts >= AUTH.MAX_FAILED_ATTEMPTS && tempUser.loginAttemptTime > new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)) {
    const remainingTime = Math.round((tempUser.loginAttemptTime - new Date(new Date() - AUTH.FAILED_ATTEMPT_TIMEOUT)) / (60*1000));
    throw new ResponseError(401, `This Account has been locked, please try again in ${remainingTime} minutes`);
  }
  tempUser.loginAttemptTime = new Date();
  const storedPassword = tempUser.password;
  const passwordMatch = await bcrypt.compare(password, storedPassword);
  if (passwordMatch) {
    const data = await handleLoginSuccess(employeeId);
    tempUser.currentAccessToken = data.token;
    tempUser.failedLoginAttempts = 0;
    await tempUser.save();
    return data;
  } 
  else {
    tempUser.failedLoginAttempts = (tempUser.failedLoginAttempts || 0) + 1;
    await tempUser.save();
    throw new ResponseError(401, "Invalid credentials");
  }
};

export const handleLoginSuccess = async (employeeId) => {
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
  return {
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
  };
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
    }
    else if (!user.email) {
      return res.status(400).json({ message: "Email not given, Please contact an Admin" });
    }
    else {
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

export const imageUploadTest = async (req, res) => {
  try {
    const response = await imageUploadMultiple(req.files, "cms-product", "product");
    res.status(200).json({ message: response.message, fileNames: response.fileNames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

