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
      unique: {
        args: true,
        msg: "User Role already exists",
      },
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

UserRole.belongsTo(branches, {foreignKey: "branchId",});
branches.hasMany(UserRole, {foreignKey: "branchId",});

export default UserRole;
