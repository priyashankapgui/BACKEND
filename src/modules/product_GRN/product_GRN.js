import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import products from '../product/product.js';
import grn from '../GRN/grn.js';
import productBatchSum from '../productBatchSum/productBatchSum.js';
import { updateProductBatchSum } from '../productBatchSum/service.js'; 

const productGRN = sequelize.define(
  "product_GRN",
  {
    productId: { 
      type: DataTypes.STRING,
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
      primaryKey: true,
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
      allowNull: false,
    },
    availableQty: { 
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    
    comment: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  },
  {
    tableName: "product_GRN",
    timestamps: true, 
    indexes: [
      {
        unique: true,
        fields: ['productId', 'GRN_NO', 'batchNo']
      }
    ],
    hooks: {
      // Before creating a new record in product_GRN
      beforeCreate: async (productGRNInstance, options) => {
        productGRNInstance.availableQty = productGRNInstance.totalQty; 
      },
      afterCreate: async (productGRNInstance) => {
        await updateProductBatchSum(productGRNInstance.productId, productGRNInstance.batchNo);
      },
      afterUpdate: async (productGRNInstance) => {
        await updateProductBatchSum(productGRNInstance.productId, productGRNInstance.batchNo);
      },
      afterDestroy: async (productGRNInstance) => {
        await updateProductBatchSum(productGRNInstance.productId, productGRNInstance.batchNo);
      }
    }
  }
);

export default productGRN;
 