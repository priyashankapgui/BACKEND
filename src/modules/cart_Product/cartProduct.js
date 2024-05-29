import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import ShoppingCart from "../Cart_Customer/shoppingcart.js";
import products from "../product/product.js";

const cart_Product = sequelize.define(
  "cart_Product",
  {
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      references: {
        model: ShoppingCart,
        key: 'cartId'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      references: {
        model: products,
        key: 'productId'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 // Assuming default quantity is 1
    }
  },
  {
    tableName: "cart_Product",
    // primaryKey: ['cartId', 'productId'], // Define composite primary key
  }
);

export default cart_Product;
