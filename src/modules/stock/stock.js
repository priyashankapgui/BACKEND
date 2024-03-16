import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';


const stocks = sequelize.define('stocks', {
  GRN_NO: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  invoiceNo: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {
  tableName: 'stocks',
  
});



export default stocks;
