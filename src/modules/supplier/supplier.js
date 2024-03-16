import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
//import products from '../product/product.js';
//import products from '../product/product.js';

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
  branchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  regNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },


}, { 
  tableName: 'suppliers',
  timestamps: false 
});

//suppliers.belongsToMany(products, { through: 'product_Supplier' });
//suppliers.hasMany(products, { foreignKey: 'productId', as: 'products' });

export default suppliers;
