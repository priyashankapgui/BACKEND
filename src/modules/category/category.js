import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import products from '../product/product.js';

const Category = sequelize.define('categories', {
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },

}, {tableName: 'categories'});


export const setupCategoryAssociations = () => {
  Category.hasMany(products, { foreignKey: 'categoryId', as: 'products' });
};




export default Category;