import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";



const grn = sequelize.define(
  "grn",
  {
    GRN_NO: {
      type: DataTypes.STRING, 
      allowNull: false,
      primaryKey: true,
    },
    invoiceNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: suppliers,
        key: "supplierId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    }, 
  },
  {
    tableName: "grn",
  }
);

export const setupProductGRNAssociations = () => {
  grn.belongsToMany(products, { through: "product_GRN" });
};

export default grn;


