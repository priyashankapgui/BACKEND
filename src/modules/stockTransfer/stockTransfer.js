import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const stockTransfer = sequelize.define(
  "stockTransfer",
  {
    STN_NO: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    requestBranch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supplyingBranch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    requestedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    status: {
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
    tableName: "stockTransfer",
    timestamps: true,
  }
);

export default stockTransfer;
