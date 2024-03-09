import  Sequelize  from 'sequelize';
const {DATABASE_HOST, DATABASE_USERNAME, DATABSE_PASSWORD, DATABASE_NAME } = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME,DATABSE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'mysql',
});



export default sequelize;