import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import invoices from "../invoice/invoice.js";

const grn = sequelize.define(
  "GRN",
  {
    GRN_NO: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    invoiceNo: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: invoices,
        key: "invoiceNo",
        onDelete: "CASCADE",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batchNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    freeQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "stocks",
  }
);

grn.belongsTo(invoices, { foreignKey: "invoiceNo" });

export default grn;

//stocks.belongsTo(invoices, { foreignKey: 'invoiceNo' })
