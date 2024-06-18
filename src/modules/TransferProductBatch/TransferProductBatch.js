import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import TransferProduct from '../TransferProduct/TransferProduct.js';


const TransferProductBatch = sequelize.define('TransferProductBatch', {
  STN_NO: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: TransferProduct,
      key: 'STN_NO',
    },
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: TransferProduct,
      key: 'productId',
    },
  },
 
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  transferQty: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },

  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },

  
 
}, {
  tableName: 'TransferProductBatch',
  timestamps: false,
  
}
);

export default TransferProductBatch;