import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js'; // Adjust the path if necessary

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
    billedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current date and time
        get() {
            const rawValue = this.getDataValue('billedAt');
            // Check if rawValue is a valid date
            if (rawValue instanceof Date && !isNaN(rawValue)) {
                // Formatting the date to remove the time portion
                return rawValue.toISOString().split('T')[0];
            } else {
                return null; // Return null if rawValue is not a valid date
            }
        },
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
