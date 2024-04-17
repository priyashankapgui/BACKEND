import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import categories from "../category/category.js";
import suppliers from "../supplier/supplier.js";
import grn from "../GRN/grn.js";
//import productSupplier from "../product_Supplier/product_Supplier.js";

const products = sequelize.define(
  "products",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: categories,
        key: "categoryId",
        onDelete: "SETNULL",
      },
    },
  },
  { tableName: "products" }
);

products.belongsToMany(suppliers, { through: "product_Supplier" });
products.belongsToMany(grn, { through: "product_Stock" });
products.belongsTo(categories, { foreignKey: "categoryId" });

export default products;
