import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
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
    branchName: {
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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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

refund_Bill.addHook('beforeValidate', async (refundBill) => {
    // Fetch branchId, branchName, and customerName using billNo
    const billDetails = await bill.findByPk(refundBill.billNo);
    if (billDetails) {
        refundBill.branchId = billDetails.branchId;
        refundBill.branchName = billDetails.branchName;
        refundBill.customerName = billDetails.customerName;
    }
});

export default refund_Bill;
