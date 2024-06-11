import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';

const ProductBatchUpdateReason = sequelize.define('ProductBatchUpdateReason', {
  // reasonId: {
  //   type: DataTypes.INTEGER,
  //   autoIncrement: true,
  //   primaryKey: true,
  // },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ProductBatchSum,
      key: 'productId',
    },
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ProductBatchSum,
      key: 'batchNo',
    },
  },
  branchId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ProductBatchSum,
      key: 'branchId',
    },
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
      defaultValue: DataTypes.NOW,
      allowNull: true,
       primaryKey: true,
  },
  updateType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'product_batch_update_reason',
  timestamps: false,
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ['productId', 'batchNo', 'branchId', 'updatedAt'],
  //     name: 'unique_reason_index'
  //   }
  // ]
});

export default ProductBatchUpdateReason;
