import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import categories from "../category/category.js";
import suppliers from "../supplier/supplier.js";
import grn from "../GRN/grn.js";
import branches from "../branch/branch.js";
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
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: branches,
        key: "branchId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    barcode: { 
      type: DataTypes.STRING, 
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: categories,
        key: "categoryId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    },
    
  },
  { tableName: "products",
    timestamps: true, 
  }
);

products.belongsToMany(suppliers, { through: "product_Supplier" });

products.belongsTo(categories, { foreignKey: "categoryId" });
products.belongsTo(branches, { foreignKey: "branchId" });


export const setupProductGRNAssociations = () => {
  products.belongsToMany(grn, { through: "product_GRN" });
};



export default products;
