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
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        primaryKey: true
        
    },
    pageAccessId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: PageAccess,
            key: 'pageId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        primaryKey: true
    },
    
    }, 
    { 
        tableName: 'permission',
    }
);


export default Permission;