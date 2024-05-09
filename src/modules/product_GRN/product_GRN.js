import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import products from '../product/product.js';
import grn from '../GRN/grn.js';

const productGRN = sequelize.define(
  "product_GRN",
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   allowNull: false,
    //   autoIncrement: true
    // },
    productId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: products,
        key: 'productId'
      }
    },
    GRN_NO: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: grn,
        key: 'GRN_NO'
      }
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
    availableQty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  },
  {
    tableName: "product_GRN",
    timestamps: true,
    hooks: {
      // Before creating a new record in product_GRN
      beforeCreate: async (productGRNInstance, options) => {
        
        productGRNInstance.availableQty = productGRNInstance.totalQty;
      }
    }
  }
);

productGRN.belongsTo(products, { foreignKey: 'productId' });
productGRN.belongsTo(grn, { foreignKey: 'GRN_NO' });

export default productGRN;

