import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bcrypt from 'bcryptjs';


const Employee = sequelize.define('employee', {
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    
    }, 
    { 
        tableName: 'employee',
        hooks: {
            async beforeSave(employee) {
                if (employee.changed('password')) {
                    const saltRounds = bcrypt.genSaltSync(10); 
                    //employee.password = await(employee.password, saltRounds);
                    employee.password = await bcrypt.hash(employee.password, saltRounds);
                }
            },
        },
    });
    
export default Employee;
  
