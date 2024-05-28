import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const productStock = sequelize.define(
  "product_Stock",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    GRN_NO: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "product_Stock",
  }
);

export default productStock;
