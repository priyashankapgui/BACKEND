import Employee from "../employee/employee.js";





export const getAllEmployees = async () => {
    try {
        const employees = await Employee.findAll();
        return employees;
    } catch (error) {
        throw new Error('Error retrieving employees');
    }
    };

export const getEmployeeById = async (employeeId) => { 
    try {
        const employee = await Employee.findByPk(employeeId);
        return employee;
    } catch (error) {
        throw new Error('Error fetching employee: ' + error.message);
    }
};


export const createEmployee = async (employee) => {
  try {
    const newEmployee = await Employee.create(employee);
    return newEmployee;
  } catch (error) {
    throw new Error('Error creating employee: ' + error.message);
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
    throw new Error('Error updating employee: ' + error.message);
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
    throw new Error('Error deleting employee: ' + error.message);
  }
};

