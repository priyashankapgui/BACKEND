import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bcrypt from 'bcryptjs';
import branches from '../branch/branch.js';


const Employee = sequelize.define('employee', {
    employeeId: {
        type: DataTypes.STRING,
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
    
    branchId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: branches,
            key: 'branchId',
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    },

    branchName: {
        type: DataTypes.STRING,
        allowNull: true,
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
            async beforeCreate(employee) {
                await branches.findOne({
                    where: {
                        branchId: employee.branchId
                    }
                }).then((branch) => {
                    employee.branchName = branch.branchName;
                });
            },
            async beforeSave(employee) {
                if (employee.changed('password')) {
                    const saltRounds = bcrypt.genSaltSync(10); 
                    employee.password = await bcrypt.hash(employee.password, saltRounds);
                }

            },
        },
    });
    
export default Employee;
  
