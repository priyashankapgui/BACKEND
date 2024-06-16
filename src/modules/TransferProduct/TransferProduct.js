import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import stockTransfer from "../stockTransfer/stockTransfer.js";
import products from "../product/product.js";
//import TransferProductBatch from "../TransferProductBatch/TransferProductBatch.js";


const TransferProduct = sequelize.define(
  "Transfer_Product",
  {
    STN_NO: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: stockTransfer, 
          key: 'STN_NO'
        }
      },
    productId: { 
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: products,
        key: 'productId'
      } 
    },
    
    requestedQty: {
      type: DataTypes.FLOAT,
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
    tableName: "Transfer_Product", 
    indexes: [
      {
        unique: false,
        fields: ['productId']
      },
      {
        unique: false,
        fields: ['STN_NO']
      },
      
    ],
    
   
    
  }
);




export default TransferProduct;
 