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
        allowNull: false,
    },
    password: {
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