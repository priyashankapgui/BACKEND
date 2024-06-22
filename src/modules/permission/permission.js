import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import UserRole from '../userRole/userRole.js';
import PageAccess from '../pageAccess/pageAccess.js';

const Permission = sequelize.define('permission', {
    userRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserRole,
            key: 'userRoleId',
        },
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
        
    },
    pageAccessId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: PageAccess,
            key: 'pageId',
        },
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    
    }, 
    { 
        tableName: 'permission',
    }
);


export default Permission;