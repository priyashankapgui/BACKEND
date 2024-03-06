import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import suppliers from '../supplier/supplier.js';

const supplierContact = sequelize.define('supplierContact', {
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { 
  tableName: 'supplierContact',
  timestamps: false 
});

supplierContact.belongsTo(suppliers, { foreignKey: 'supplierId' }); 

export default supplierContact;
