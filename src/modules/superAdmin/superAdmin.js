import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bcrypt from 'bcryptjs';
import UserRole from '../userRole/userRole.js';

const SuperAdmin = sequelize.define('superAdmin', {
    superAdminId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    
    superAdminName: {
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
    userRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserRole,
            key: 'userRoleId',
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
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
        tableName: 'superAdmin',
        hooks: {
            async beforeSave(employee) {
                if (employee.changed('password')) {
                    const saltRounds = bcrypt.genSaltSync(10); 
                    employee.password = await bcrypt.hash(employee.password, saltRounds);
                }
            } 
        },
    }
);


export default SuperAdmin;