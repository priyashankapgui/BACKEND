import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const products = sequelize.define('products', {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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
  
  
  }, {tableName: 'products'});
  
  export default products;