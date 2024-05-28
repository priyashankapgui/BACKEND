import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";
import bill from "../bill/bill.js";

const branches = sequelize.define('branches', {
    branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING(15)
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    
},
{
    tableName: 'branches',
    timestamps: false // Disable automatic createdAt and updatedAt timestamps
});

export const setupBranchSupplierAssociations = () => {
    branches.belongsToMany(suppliers, { through: "branch_Supplier" });
};

export default branches;
