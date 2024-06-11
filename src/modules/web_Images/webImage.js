import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const feedback = sequelize.define('webImage', {
    imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagePosition: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
  
 


  
}, { tableName: 'webImage' });




export default feedback;
