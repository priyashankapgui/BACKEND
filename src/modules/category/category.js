import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import products from "../product/product.js";

const categories = sequelize.define(
  "categories",
  {
    categoryId: {
      type: DataTypes.  STRING,
      allowNull: false,
      primaryKey: true,
      
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  //   updatedAt: {
  //     type: 'TIMESTAMP',
  //     defaultValue: DataTypes.NOW,
  //     allowNull: false
  // },
    
  },
  { tableName: "categories",
  }
);




export default categories;
