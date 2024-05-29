import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import products from "../product/product.js";

const ShoppingCart = sequelize.define(
  "shoppingcart",
  {
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  },
  { tableName: "shoppingcart" }
);

export const setupCartProductAssociations =() =>{
  ShoppingCart.belongsToMany(products,{through:"cart_Product"});
}

export default ShoppingCart;