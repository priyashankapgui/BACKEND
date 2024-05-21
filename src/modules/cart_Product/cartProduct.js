import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import ShoppingCart from "../Cart_Customer/shoppingcart.js";
import products from "../product/product.js";

const cartProduct = sequelize.define(
  "cartProducts",
  {
    shoppingcartCartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ShoppingCart,
        key: 'cartId'
      }
    },
    productProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    timestamps: true,
  }
);

// Correctly define the associations
cartProduct.belongsTo(ShoppingCart, { foreignKey: 'shoppingcartCartId' });
cartProduct.belongsTo(products, { foreignKey: 'productProductId' });

export default cartProduct;
