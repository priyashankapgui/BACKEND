import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import onlineBill from '../online_Bill/onlineBill.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';

const OnlineBillProduct = sequelize.define('OnlineBillProduct', {
  onlineBillNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: onlineBill,
      key: 'onlineBillNo'
    },
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: ProductBatchSum,
      key: 'productId'
    },
    primaryKey: true,
  },
  batchNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: ProductBatchSum,
      key: 'batchNo'
    },
    primaryKey: true,
  },
  branchId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: ProductBatchSum,
      key: 'branchId'
    },
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  PurchaseQty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
}, {
  tableName: 'online_Bill_Products',
  timestamps: false
});

export default OnlineBillProduct;
