import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const stock = sequelize.define('stock', {
  batchNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitBuyingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unitSellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availableQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, { 
  tableName: 'stock',
  timestamps: false
});

export default stock;
