// import  sequelize  from '../../../config/database.js';
import { getAllEmployees,getEmployeeById,createEmployee,updateEmployeeById,deleteEmployeeById } from "../employee/service.js";
import bcrypt from 'bcrypt';
import Employee from './employee.js';


// export const test = async (req, res) => {
//     try {
//         await sequelize.authenticate();
//         res.status(200).json({ message: 'Connection has been established successfully.' });
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.error('Unable to connect to the database:', error);
//       }
//   };
  

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
        res.status(404).json({ error: 'Employee not found' });
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
      // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(employee.password, 10);
    employee.password = hashedPassword;

      const newEmployee = await createEmployee(employee);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const updateEmployee = async (req, res) => {
    const employeeId = req.params.employeeId;
    const updatedEmployeeData = req.body;
    try {
      const updatedEmployee = await updateEmployeeById(employeeId, updatedEmployeeData);
      if (!updatedEmployee) {
        res.status(404).json({ error: 'Employee not found' });
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
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };





 // Function to handle login
export const handleLogin = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user in the database based on the provided username
    const user = await Employee.findOne({ where: { employeeId: employeeId } });

    if (!user) {
      // User not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the hashed password stored in the database with the provided password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      // Passwords match, login successful
      return res.status(200).json({ message: 'Login successful' });
    } else {
      // Passwords don't match, login failed
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
