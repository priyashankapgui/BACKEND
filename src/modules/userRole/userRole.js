import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const UserRole = sequelize.define(
  "userRole",
  {
    userRoleId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userRoleName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userRoleBranch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pageAccess: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    tableName: "userRole",
  }
);

export default UserRole;
