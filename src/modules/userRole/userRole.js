import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import PageAccess from "../pageAccess/pageAccess.js";
import branches from "../branch/branch.js";

const UserRole = sequelize.define(
  "userRole",
  {
    userRoleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userRoleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    branchId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: branches,
        key: "branchId",
      },
    },
  },
  {
    tableName: "userRole",
  }
);

export default UserRole;
