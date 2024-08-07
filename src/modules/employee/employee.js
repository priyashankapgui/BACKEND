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
                isEmail: {
                    args: true,
                    msg: "Email address is invalid"
                },
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
                is: {
                    args: /(^(\+94|0)?[1-9]{2}[0-9]{7}$)|(^(\+94|0)?7[0-9]{8}$)/,
                    msg: "Phone number is invalid"
                },
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
            onUpdate: "CASCADE",
            validate: {
                notIn: [[1]]
            }
        },
        failedLoginAttempts:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:true,
        },
        loginAttemptTime :{
            type: DataTypes.DATE,
            allowNull:true, 
        }, 
        currentAccessToken: {
            type: DataTypes.STRING,
            allowNull: true,
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
                },
            },
        },
    );

Employee.belongsTo(UserRole, {foreignKey: 'userRoleId', onDelete: 'RESTRICT', onUpdate: 'CASCADE'});
UserRole.hasMany(Employee, {foreignKey: 'userRoleId'});


export default Employee;
  
