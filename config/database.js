import  Sequelize  from 'sequelize';

const sequelize = new Sequelize('cms', 'root', 'pass123', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;