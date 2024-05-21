import dotenv from "dotenv";
import  Sequelize  from 'sequelize';
dotenv.config();
const {DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

console.log(process.env.DATABASE_HOST);

const sequelize = new Sequelize('cms', 'root', 'AcHa@1220',  {
  host: 'localhost',
  dialect: 'mysql',
});



export default sequelize;