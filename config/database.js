import  Sequelize  from 'sequelize';

const sequelize = new Sequelize('green', 'root', 'pass123', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;