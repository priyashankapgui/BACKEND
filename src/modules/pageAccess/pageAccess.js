import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import { authPlugins } from 'mysql2';


const PageAccess = sequelize.define('pageAccess', {
    pageId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    
    pageName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    }, 
    { 
        tableName: 'pageAccess',
    }
);


export default PageAccess;