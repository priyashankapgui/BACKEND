import { DataTypes } from 'sequelize';
import sequelize from "../../config/database.js";

const category = sequelize.define('category', {
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

}, {tableName: 'category'});

export default category;