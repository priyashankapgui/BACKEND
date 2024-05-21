import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const ShoppingCart = sequelize.define(
  "shoppingcart",
  {
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // customerId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   references: {
    //     model: Customer,
    //     key: "customerId",
    //   },
    // },
    // productId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Product,
    //     key: "productId",
    //   },
    // },
    // quantity: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 1, // Assuming default quantity is 1
    // },
  },
  { tableName: "shoppingcart" }
);

export default ShoppingCart;