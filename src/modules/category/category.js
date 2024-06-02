import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const categories = sequelize.define(
  "categories",
  {
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, 
    },
  },
  {
    tableName: "categories", 
    timestamps: true,
  }
);

export default categories;
