import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Branch from "../branch/branch.js";

const Sales = sequelize.define('Sales', {
    saleId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    branchId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Branch,
            key: 'branchId'
        }
    },
    saleDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'sales',
    timestamps: true
});

// Define associations
Sales.belongsTo(Branch, { foreignKey: 'branchId' });

export default Sales;
