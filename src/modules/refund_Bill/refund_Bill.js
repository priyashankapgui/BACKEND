import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js';
import bill from '../bill/bill.js';

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
    },
    returnedBy: {
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
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refundTotalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: 'TIMESTAMP',
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
