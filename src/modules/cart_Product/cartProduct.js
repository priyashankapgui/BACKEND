import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import ShoppingCart from "../cart_Customer/shoppingcart.js";
import products from "../product/product.js";

const CartProduct = sequelize.define("CartProduct", {
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ShoppingCart,
      key: 'cartId'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: products,
      key: 'productId'
    }
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  }
}, {
  tableName: "cart_Product",
});

export default CartProduct;