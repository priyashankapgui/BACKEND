import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js';

const bill = sequelize.define('bill', {
    billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    branchId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchName: {
        type: DataTypes.STRING,
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
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    billTotalAmount: {
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
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, {
    tableName: 'bill',
    timestamps: false,
});

// Set up association
bill.belongsTo(branches, { foreignKey: 'branchId', targetKey: 'branchId' });

// Hook to set branchName
bill.addHook('beforeCreate', async (bill, options) => {
    console.log("Before Create Hook Called");
    const branch = await branches.findByPk(bill.branchId);
    if (branch) {
        bill.branchName = branch.branchName;
        console.log(`Branch Name Set: ${bill.branchName}`);
    } else {
        throw new Error('Branch not found');
    }
});

bill.addHook('beforeUpdate', async (bill, options) => {
    console.log("Before Update Hook Called");
    const branch = await branches.findByPk(bill.branchId);
    if (branch) {
        bill.branchName = branch.branchName;
        console.log(`Branch Name Set: ${bill.branchName}`);
    } else {
        throw new Error('Branch not found');
    }
});

export default bill;
