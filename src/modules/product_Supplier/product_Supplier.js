import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import products from '../product/product.js';
import suppliers from '../supplier/supplier.js';

const productSupplier = sequelize.define(
  'product_Supplier',
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   allowNull: false,
    //   autoIncrement: true
    // },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: products,
        key: 'productId'
      }
    },
    supplierId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      primaryKey: true,
      references: {
        model: suppliers, 
        key: 'supplierId'
      }
    },
  }, 
  {
    tableName: 'product_Supplier',
    timestamps: true,
  }
);

productSupplier.belongsTo(products, { foreignKey: 'productId' });
productSupplier.belongsTo(suppliers, { foreignKey: 'supplierId' });

export default productSupplier;
 