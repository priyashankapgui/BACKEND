import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import grn from '../GRN/grn.js';

const invoices = sequelize.define('invoices', {
  invoiceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }

}, 
{ 
  tableName: 'invoices',
});


export const setupInvoiceAssociations = () => {
    invoices.hasMany(grn, { foreignKey: 'GRN_NO', as: 'grn' });
  };



export default invoices;
