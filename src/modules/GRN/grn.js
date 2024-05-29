import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";
import branches from "../branch/branch.js";

const grn = sequelize.define(
  "grn",
  {
    GRN_NO: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    invoiceNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: branches,
        key: "branchId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    },
    supplierId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: suppliers,
        key: "supplierId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  },
  {
    tableName: "grn",
    timestamps: true,
  }
);


export default grn;


