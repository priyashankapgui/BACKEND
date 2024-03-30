import  Sequelize  from 'sequelize';

const sequelize = new Sequelize('cms', 'root', 'BCV8376u#', {
  host: 'localhost',
  dialect: 'mysql',
 
});

export default sequelize;