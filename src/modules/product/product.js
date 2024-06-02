import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import categories from "../category/category.js";
import grn from "../GRN/grn.js";
//import productSupplier from "../product_Supplier/product_Supplier.js";

const products = sequelize.define(
  "products",
  {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: categories,
        key: "categoryId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    },
   
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    
  },
  { tableName: "products",
    timestamps: true, 
    
  }
);





export default products;
