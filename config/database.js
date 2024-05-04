import dotenv from "dotenv";
import  Sequelize  from 'sequelize';
dotenv.config();
const {DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

console.log(process.env.DATABASE_HOST);

const sequelize = new Sequelize(DATABASE_NAME,DATABASE_USERNAME,DATABASE_PASSWORD,  {
  host: DATABASE_HOST,
  dialect: 'mysql',
});



export default sequelize;