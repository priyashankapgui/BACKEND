import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import supplierContact from '../suppliers/supplierContact.js';

const suppliers = sequelize.define('suppliers', {
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supplierContactNo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, { 
  tableName: 'suppliers',
  timestamps: false 
});

suppliers.hasMany(supplierContact, { foreignKey: 'supplierId' });

export default suppliers;
