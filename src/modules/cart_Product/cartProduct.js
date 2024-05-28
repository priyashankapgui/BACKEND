import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import ShoppingCart from "../cart_Customer/shoppingcart.js";
import products from "../product/product.js";

const cart_Product = sequelize.define(
  "cart_Product",
  {
    shoppingcartCartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: ShoppingCart,
        key: 'cartId'
      }
    },
    productProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
  }
);

cart_Product.belongsTo(ShoppingCart, { foreignKey: 'shoppingcartCartId' });
cart_Product.belongsTo(products, { foreignKey: 'productProductId' });

export default cart_Product;
