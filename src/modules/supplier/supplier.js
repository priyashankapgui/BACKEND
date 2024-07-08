import { DataTypes } from "sequelize";
import sequelize from '../../../config/database.js';

const suppliers = sequelize.define(
  "suppliers",
  {
    supplierId: {
      type: DataTypes.STRING, 
      allowNull: false,
      primaryKey: true,
      
    },
    supplierName: {
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
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  },
  {
    tableName: "suppliers",
    timestamps: true,
  }
);



export default suppliers;
