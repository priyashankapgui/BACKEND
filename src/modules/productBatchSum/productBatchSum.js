import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
//import productGRN from '../productGRN/productGRN.js';

const productBatchSum = sequelize.define('productBatchSum', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  totalAvailableQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

}, { 
  tableName: 'product_batch_sum',
  timestamps: false,
});

export default productBatchSum;
