import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bill from '../bill/bill.js';
import branches from '../branch/branch.js';

const refund_Bill = sequelize.define('refund_Bill', {
    RTBNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: bill,
            key: 'billNo'
        },
    },
    branchId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: branches,
            key: 'branchId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    returnedBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'refund_Bill',
    timestamps: true,
});

// Define associations
refund_Bill.belongsTo(bill, { foreignKey: 'billNo' });
refund_Bill.belongsTo(branches, { foreignKey: 'branchId' });

export default refund_Bill;
