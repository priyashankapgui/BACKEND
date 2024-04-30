import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import products from "../product/product.js";
import branches from "../branch/branch.js";
//import grn from "../GRN/grn.js";

const suppliers = sequelize.define(
  "suppliers",
  {
    supplierId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "suppliers",
    timestamps: true,
  }
);

export const setupProductSupplierAssociations = () => {
  suppliers.belongsToMany(products, { through: "product_Supplier" });
};

suppliers.belongsToMany(branches, { through: "branch_Supplier" });


// export const setupGRNSUPPLIERAssociations = () => {
//   suppliers.hasMany(grn, { foreignKey: "GRN_NO", as: "grn" });
// };

export default suppliers;
