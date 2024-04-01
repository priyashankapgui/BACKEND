import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const suppliers = sequelize.define(
  "suppliers",
  {
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "suppliers",
    timestamps: false,
  }
);

export default suppliers;
