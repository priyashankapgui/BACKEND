import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js';
import Customer from '../customer/customer.js';

const onlineBill = sequelize.define('onlineBill', {
  onlineBillNo: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  branchId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: branches,
      key: 'branchId' 
    }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customerId'
    }
  },
  onlineBillTotal:{
    type:DataTypes.FLOAT,
    allowNull:true,
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  acceptedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  acceptedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "New",
    allowNull: false,
  },
  pickupTime: { 
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
  pickupBy:{ 
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'OnlineBill'
});

export default onlineBill;
