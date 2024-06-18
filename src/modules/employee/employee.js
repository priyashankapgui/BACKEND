import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bcrypt from 'bcryptjs';
import branches from '../branch/branch.js';
import UserRole from '../userRole/userRole.js';
import { validate } from 'uuid';


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
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^(?:7|0|(?:\+94))[0-9]{9,10}$/,
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userRoleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserRole,
            key: 'userRoleId',
            },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    },
    }, 
    { 
        tableName: 'employee',
        hooks: {
            // async beforeCreate(employee) {
            //     await UserRole.findOne({
            //         where: {
            //             userRoleId: employee.userRoleId
            //         }
            //     }).then((userRole) => {
            //         employee.userRoleName = userRole.userRoleName;
            //     });
            //     await branches.findOne({
            //         where: {
            //             branchId: employee.branchId
            //         }
            //     }).then((branch) => {
            //         employee.branchName = branch.branchName;
            //     });
            // },
            
            async beforeSave(employee) {
                if (employee.changed('password')) {
                    const saltRounds = bcrypt.genSaltSync(10); 
                    employee.password = await bcrypt.hash(employee.password, saltRounds);
                }
                // // Check if branch and branchId are related
                // const relatedBranch = await branches.findOne({
                //     where: {
                //         branchId: employee.branchId
                //     }
                // });
                // if (relatedBranch.dataValues.branchName !== employee.branchName) {
                //     throw new Error('BranchName and branchId are not related');
                // }
                },
            },
        },
    );

Employee.belongsTo(UserRole, {foreignKey: 'userRoleId', onDelete: 'RESTRICT', onUpdate: 'CASCADE'});
UserRole.hasMany(Employee, {foreignKey: 'userRoleId'});


export default Employee;
  
