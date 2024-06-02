import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const bill = sequelize.define('bill', {
    billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    branchId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'branches',
            key: 'branchId'
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billedAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    billedBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'bill',
    timestamps: true,
});

export default bill;
