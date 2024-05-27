import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const ListedProducts = sequelize.define('listedProducts', {

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  barcode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avbQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, { tableName: 'listedProducts' });

export default ListedProducts;