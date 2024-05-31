import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const feedback = sequelize.define('feedback', {
  feedbackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feedbackType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 action: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: 'Pending'
 },
 actionSummary: {
        type: DataTypes.STRING,
        allowNull: true,
    }


  
 


  
}, { tableName: 'feedbacks' });




export default feedback;
