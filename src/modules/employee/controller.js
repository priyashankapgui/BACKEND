// import  sequelize  from '../../../config/database.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
} from "../employee/service.js";
import { SECRET } from "../../../config/config.js";
const { SECRET_KEY: ACCESS_TOKEN } = SECRET;

export const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const employee = await getEmployeeById(employeeId);
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewEmployee = async (req, res) => {
  const employee = req.body;
  try {
    const newEmployee = await createEmployee(employee);
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  const updatedEmployeeData = req.body;

  console.log(employeeId);

  try {
    const updatedEmployee = await updateEmployeeById(
      employeeId,
      updatedEmployeeData
    );
    if (!updatedEmployee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const deleteEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const deletedEmployee = await deleteEmployeeById(employeeId);
    if (!deletedEmployee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const forgotPassword = async (req, res) => {
//   const { token } = req.query;

//   // Verify the token
//   try {
//     const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
//     const { email } = decoded;

//     // Check if the token matches the one associated with the user's account
//     const user = await Employee.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {}
// };
