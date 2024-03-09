import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import categories from '../category/category.js';


const products = sequelize.define('products', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  colour: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: categories, 
      key: 'categoryId', 
      onDelete: 'CASCADE', 
    },
  },
}, { tableName: 'products' });

products.belongsTo(categories, { foreignKey: 'categoryId' });

export default products;
