import Sequelize from 'sequelize';
const { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

const sequelize = new Sequelize('cms', 'root', 'AcHa@1220', {
  host: 'localhost',
  dialect: 'mysql',
});



export default sequelize;